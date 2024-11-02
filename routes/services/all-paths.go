package services

import (
	"24uzr-route-server/transport"
	"log"
	"sort"
)

type adjacencyMatrix struct {
	nodeNames       map[int]string
	nodeIdx         map[string]int
	link            [][]int
	metres          [][]float32
	metresPerSecond [][][]float32
}

type traveledPath struct {
	metres  float32
	seconds float32
	path    []int
}

func FindAllPaths(
	route transport.Route,
	graph transport.Graph,
	time float32,
	count int,
) transport.Routes {
	log.Println(">FindAllPaths", time/60/60, "hours", "x", count)

	m := makeAdjacencyMatrix(graph)

	s := m.nodeIdx[route.Start]
	e := m.nodeIdx[route.End]

	p := traveledPath{metres: 0, seconds: 0, path: []int{s}}
	paths := findPaths(0, time, &p, s, e, &m)

	sort.Slice(paths, func(i, j int) bool {
		return paths[i].metres > paths[j].metres
	})

	page := paths[:count]
	pathsOut := make([]transport.Path, len(page))
	for i, path := range page {
		p := make([]string, len(path.path))
		for j, n := range path.path {
			p[j] = m.nodeNames[n]
		}
		pathsOut[i] = transport.Path{Metres: path.metres, Seconds: path.seconds, Nodes: p}
	}
	routes := transport.Routes{Start: route.Start, End: route.End, Paths: pathsOut}
	log.Println("<FindAllPaths", len(routes.Paths))
	return routes
}

func findPaths(timeStart float32, timeLeft float32, path *traveledPath, start int, end int, matrix *adjacencyMatrix) []traveledPath {
	if start == end {
		return []traveledPath{*path}
	}

	if timeLeft < 0 {
		return make([]traveledPath, 0)
	}

	children := getChildren(start, matrix)

	paths := make([]traveledPath, 0)
	for _, c := range children {
		m := removeEdge(matrix, start, c)
		ti := int(timeStart / (60 * 60))
		np := copyAndAppend(m, path, ti, start, c)
		et := edgeTime(m, start, c, ti)
		pp := findPaths(timeStart+et, timeLeft-et, np, c, end, m)
		paths = append(paths, pp...)
		matrix = putEdge(m, start, c)
	}
	return paths
}

func copyAndAppend(matrix *adjacencyMatrix, path *traveledPath, ti int, start int, c int) *traveledPath {
	np := traveledPath{metres: path.metres, seconds: path.seconds, path: make([]int, len(path.path))}
	copy(np.path, path.path)
	np.path = append(np.path, c)
	np.metres = np.metres + matrix.metres[start][c]
	np.seconds = np.seconds + (matrix.metres[start][c] / matrix.metresPerSecond[start][c][ti])
	return &np
}
func getChildren(n int, m *adjacencyMatrix) []int {
	row := m.link[n]
	children := make([]int, 0)
	for c, edge := range row {
		if edge > 0 {
			children = append(children, c)
		}
	}

	return children
}

func makeAdjacencyMatrix(g transport.Graph) adjacencyMatrix {

	nodeNames := make(map[int]string)
	nodeIndices := make(map[string]int)
	i := int(0)
	// put the nodes in nodeName (nn) and nodeIndex (ni) maps
	for _, edge := range g.Edges {
		for _, nodeName := range []string{edge.Start, edge.End} {
			_, found := nodeIndices[nodeName]
			if !found {
				nodeIndices[nodeName] = i
				nodeNames[i] = nodeName
				i = i + 1
			}
		}
	}
	nodeCount := len(nodeNames)
	link := make([][]int, nodeCount)
	for i = 0; i < nodeCount; i++ {
		link[i] = make([]int, nodeCount)
	}
	for _, edge := range g.Edges {
		si := nodeIndices[edge.Start]
		ei := nodeIndices[edge.End]
		link[si][ei] = link[si][ei] + 1
		link[ei][si] = link[ei][si] + 1
	}
	metres := make([][]float32, nodeCount)
	metresPerSecond := make([][][]float32, nodeCount)
	for i = 0; i < nodeCount; i++ {
		metres[i] = make([]float32, nodeCount)
		metresPerSecond[i] = make([][]float32, nodeCount)
	}
	for _, edge := range g.Edges {
		si := nodeIndices[edge.Start]
		ei := nodeIndices[edge.End]
		metres[si][ei] = edge.Metres
		metres[ei][si] = edge.Metres
		metresPerSecond[si][ei] = make([]float32, len(edge.MetresPerSecondSE))
		metresPerSecond[ei][si] = make([]float32, len(edge.MetresPerSecondES))
		copy(metresPerSecond[si][ei], edge.MetresPerSecondSE)
		copy(metresPerSecond[ei][si], edge.MetresPerSecondES)
	}

	return adjacencyMatrix{nodeNames: nodeNames, nodeIdx: nodeIndices, link: link, metres: metres, metresPerSecond: metresPerSecond}
}

func edgeTime(m *adjacencyMatrix, si int, ei int, ti int) float32 {
	return m.metres[si][ei] / m.metresPerSecond[si][ei][ti]
}

func removeEdge(m *adjacencyMatrix, s int, e int) *adjacencyMatrix {
	if m.link[s][e] > 0 {
		m.link[s][e] = m.link[s][e] - 1
		m.link[e][s] = m.link[e][s] - 1
	}
	return m
}
func putEdge(m *adjacencyMatrix, s int, e int) *adjacencyMatrix {
	m.link[s][e] = m.link[s][e] + 1
	m.link[e][s] = m.link[e][s] + 1
	return m
}
