import { useEffect, useState } from "react"

const useClientDimensions = () => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const updateWindowDimensions = () => {
      const newHeight = window.innerHeight
      const newWidth = window.innerWidth
      if (newHeight !== height) setHeight(newHeight)
      if (newWidth !== width) setWidth(newWidth)
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