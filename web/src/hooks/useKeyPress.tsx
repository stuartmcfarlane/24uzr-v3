import { useCallback, useEffect, useMemo, useState } from "react";

export default function useKeyPress(target: KeyboardEvent["key"] | KeyboardEvent["key"][]): boolean {

    const keys = useMemo(
        () => (
            Array.isArray(target) ? target : [target]
        ),
        [target]
    )
    
    const [keyPressed, setKeyPressed] = useState(false);
    
    const downHandler: EventListener = useCallback(
        (e) => {
            const key = (e as KeyboardEvent).key
            if (keys.find(k => k === key)) {
                setKeyPressed(true);
            }
        },
        [keys],
    );
    
    const upHandler: EventListener = useCallback(
        (e) => {
            const key = (e as KeyboardEvent).key
            if (keys.find(k => k === key)) {
                setKeyPressed(false);
            }
        },
        [keys],
    );
    
    useEffect(() => {
        if (!window) {
            return;
        }
        
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, [downHandler, upHandler]);
    
    return keyPressed;
}