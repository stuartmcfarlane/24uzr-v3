"use client"

import { useState, useEffect, useRef, RefObject, MouseEvent } from 'react'
import { useChange } from './useChange'
import { useMousePosition, useMousePositionRelative } from './useMousePosition'

export type MousePosition = {
    mousePosition: {
        start: Point | null
        end: Point
    }
    dragging: boolean
}
export type MouseDragConstraint = (
    element: HTMLElement | SVGElement,
    mousePosition: Point
) => boolean

export function useMouseDrag(
    elementRef: RefObject<HTMLElement | SVGElement>,
    constraints: MouseDragConstraint[] = [],
    relativeRef?: RefObject<HTMLElement | SVGElement>,
): MousePosition {

    const mousePosition = (
        relativeRef
            ?useMousePositionRelative(elementRef)
            : useMousePosition()
    )
    const ref = useRef(mousePosition)

    let [ startPosition, setStartPosition] = useState<Point|null>(null)
    const [ dragging, setDragging ] = useState(false)

    const handleMouseDown = (event: MouseEvent<HTMLElement | SVGElement>) => {
        const element = (
            event.target instanceof HTMLElement
            || event.target instanceof SVGElement
        ) ? event.target : null
        if (element) {
            const valid = constraints.every(fn => fn(element, mousePosition))
            if (valid) {
                setStartPosition(ref.current)
            }
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
            start: startPosition ? { ...startPosition } : null,
            end: { ...mousePosition }
        },
        dragging
    }
}