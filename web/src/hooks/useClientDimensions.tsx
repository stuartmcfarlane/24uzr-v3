import { RefObject, useEffect, useState } from "react"

const useClientDimensions = (ref: RefObject<HTMLElement | SVGElement>) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  
  useEffect(
    () => {
      if (ref.current) {
        const domRect = ref.current.getBoundingClientRect()
        setWidth(domRect.width)
        setHeight(domRect.height)
      }
    },
    [ref.current]
  )
  useEffect(() => {
    const updateWindowDimensions = () => {
      if (ref.current) {
        const domRect = ref.current.getBoundingClientRect()
        setWidth(domRect.width)
        setHeight(domRect.height)
      }
    }
    
    window.addEventListener("resize", updateWindowDimensions)
    
    return () => window.removeEventListener("resize", updateWindowDimensions) 
    
  }, [])

  return {
    width,
    height,
  }
}

export default useClientDimensions