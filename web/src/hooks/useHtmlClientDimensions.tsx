import { fmtReal } from "@/lib/graph"
import { RefObject, useEffect, useState } from "react"

const useHtmlClientDimensions = (ref: RefObject<HTMLElement>) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  
  useEffect(
    () => {
      if (ref.current) {
        const domRect = ref.current.getBoundingClientRect()
        setWidth((was) => {
          /*(was !== domRect.width) &&  */console.log(`clientWidth ${fmtReal(was)} -> ${fmtReal(domRect.width)}`);
          return domRect.width
        })
        setHeight((was) => {
          /*(was !== domRect.height) && */ console.log(`clientHeight ${fmtReal(was)} -> ${fmtReal(domRect.height)}`);
          return domRect.height
        })
      }
    },
    [ref.current]
  )
  useEffect(() => {
    const updateWindowDimensions = () => {
      console.log(`updateWindowDimensions`, ref.current)
      if (ref.current) {
        const domRect = ref.current.getBoundingClientRect()
        setWidth((was) => {
          /*(was !== domRect.width) &&  */console.log(`clientWidth ${fmtReal(was)} -> ${fmtReal(domRect.width)}`);
          return domRect.width
        })
        setHeight((was) => {
          /*(was !== domRect.height) && */ console.log(`clientHeight ${fmtReal(was)} -> ${fmtReal(domRect.height)}`);
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

export default useHtmlClientDimensions