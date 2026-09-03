import { RefObject, useEffect } from "react";

export function useOutsideClick(ref: RefObject<HTMLElement | null>, active: boolean, onOutside: () => void): void {
    useEffect(() => {
        if (!active) {
            return;
        }
        const handler = (e: MouseEvent): void => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onOutside();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [ref, active, onOutside]);
}
