import { domRect2rect, fmtReal, rectHeight, rectWidth } from "@/lib/graph"
import { RefObject, useEffect, useState } from "react"

const useSvgClientDimensions = (svgRef: RefObject<SVGSVGElement>) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  
  useEffect(
    () => {
      if (svgRef.current) {
        const domRect = svgRef.current.getBoundingClientRect()
        setWidth((was) => {
          (was !== domRect.width) && console.log(`clientWidth ${fmtReal(was)} -> ${fmtReal(domRect.width)}`);
          return domRect.width
        })
        setHeight((was) => {
          (was !== domRect.height) && console.log(`clientHeight ${fmtReal(was)} -> ${fmtReal(domRect.height)}`);
          return domRect.height
        })
      }
    },
    [svgRef.current]
  )
  useEffect(() => {
    const updateWindowDimensions = () => {
      if (svgRef.current) {
        const domRect = svgRef.current.getBoundingClientRect()
        setWidth((was) => {
          (was !== domRect.width) && console.log(`clientWidth ${fmtReal(was)} -> ${fmtReal(domRect.width)}`);
          return domRect.width
        })
        setHeight((was) => {
          (was !== domRect.height) && console.log(`clientHeight ${fmtReal(was)} -> ${fmtReal(domRect.height)}`);
          return domRect.height
        })
      }
    }
    
    window.addEventListener("resize", updateWindowDimensions)
    
    return () => window.removeEventListener("resize", updateWindowDimensions) 
    
  }, [])

  console.log(`clientDimensions ${fmtReal(width)} ${fmtReal(height)}`)
  return {
    width,
    height,
  }
}

export default useSvgClientDimensions