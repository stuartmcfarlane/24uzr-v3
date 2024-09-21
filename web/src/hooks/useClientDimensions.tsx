import { useEffect, useState } from "react"

const useClientDimensions = () => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const updateWindowDimensions = () => {
      const newHeight = window.innerHeight
      const newWidth = window.innerWidth
      setHeight(newHeight)
      setWidth(newWidth)
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