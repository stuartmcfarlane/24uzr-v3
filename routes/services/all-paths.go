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

	nn := make(map[int]string)
	ni := make(map[string]int)
	i := int(0)
	// put the nodes in nodeName (nn) and nodeIndex (ni) maps
	for _, e := range g.Edges {
		for _, n := range []string{e.Start, e.End} {
			_, prs := ni[n]
			if !prs {
				ni[n] = i
				nn[i] = n
				i = i + 1
			}
		}
	}
	nc := len(nn)
	link := make([][]int, nc)
	for i = 0; i < nc; i++ {
		link[i] = make([]int, nc)
	}
	for _, e := range g.Edges {
		si := ni[e.Start]
		ei := ni[e.End]
		link[si][ei] = 1
		link[ei][si] = 1
	}
	metres := make([][]float32, nc)
	metresPerSecond := make([][][]float32, nc)
	for i = 0; i < nc; i++ {
		metres[i] = make([]float32, nc)
		metresPerSecond[i] = make([][]float32, nc)
	}
	for _, e := range g.Edges {
		si := ni[e.Start]
		ei := ni[e.End]
		metres[si][ei] = e.Metres
		metres[ei][si] = e.Metres
		metresPerSecond[si][ei] = make([]float32, len(e.MetresPerSecondSE))
		metresPerSecond[ei][si] = make([]float32, len(e.MetresPerSecondES))
		copy(metresPerSecond[si][ei], e.MetresPerSecondSE)
		copy(metresPerSecond[ei][si], e.MetresPerSecondES)
	}

	return adjacencyMatrix{nodeNames: nn, nodeIdx: ni, link: link, metres: metres, metresPerSecond: metresPerSecond}
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
