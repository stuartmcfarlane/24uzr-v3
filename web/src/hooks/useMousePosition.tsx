"use client"

import { RefObject, useEffect, useState } from "react";

export function useMousePosition() {
    const [ mousePosition, setMousePosition ] = useState<Point>({ x:0, y: 0 });

    const onMouseMove: EventListener = (event: MouseEventInit) => {
        setMousePosition({ x: event.clientX || 0, y: event.clientY || 0 });
    }

    useEffect(
        () => {
            window.addEventListener("mousemove", onMouseMove);
            return () => window.removeEventListener("mousemove", onMouseMove)
        },
        []
    );

    return mousePosition;
}

export function useMousePositionRelative(elementRef: RefObject<HTMLElement | SVGElement>, scale=1): Point {

    const mousePosition = useMousePosition()
    let offset = { x: 0, y: 0 }

    if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        offset = { x: rect.left, y: rect.top }
    }

    return {
        x: (mousePosition.x - offset.x) / scale,
        y: (mousePosition.y - offset.y) / scale
    }
}

