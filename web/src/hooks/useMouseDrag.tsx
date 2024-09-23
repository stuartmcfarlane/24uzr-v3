"use client"

import { useState, useEffect, useRef, RefObject } from 'react'
import { useChange } from './useChange'
import { useMousePositionRelative } from './useMousePosition'

export function useMouseDrag(elementRef: RefObject<HTMLElement | SVGElement>, constraints: Function[] = []) {

    const mousePosition = useMousePositionRelative(elementRef)
    const ref = useRef(mousePosition)

    let [ startPosition, setStartPosition] = useState<Point|null>(null)
    const [ dragging, setDragging ] = useState(false)

    const handleMouseDown: EventListener = (event: MouseEventInit) => {
        const valid = constraints.every(fn => fn(mousePosition))
        if (valid) {
            setStartPosition(ref.current)
        }
    }

    const handleMouseUp = () => {
        setDragging(false)
    }

    useEffect(() => {
        ref.current = mousePosition
    }, [ mousePosition ])

    useChange(() => {
        if (startPosition) setDragging(true)
    }, [ startPosition ])

    useEffect(() => {
        if (elementRef.current) {
            elementRef.current.addEventListener('mousedown', handleMouseDown)
            window.addEventListener('mouseup', handleMouseUp)
            return () => {
                elementRef.current?.removeEventListener('mousedown', handleMouseDown)
                window.removeEventListener('mouseup', handleMouseUp)
            }
        }
        
    }, [ elementRef.current ])

    return {
        mousePosition: {
            start: { ...startPosition },
            end: { ...mousePosition }
        },
        dragging
    }
}