import { DependencyList, useEffect, useRef } from "react"

export const useChange = (callback: Function, deps: DependencyList=[]) => {
    const initialLoad = useRef(true)

    useEffect(() => {
        if (!initialLoad.current) {
            callback()
        }

        initialLoad.current = false
    }, deps)
}

