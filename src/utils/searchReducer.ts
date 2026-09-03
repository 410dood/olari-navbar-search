export type Phase = "idle" | "probing" | "noAccess" | "searching" | "results" | "empty";

export interface SearchState {
    text: string;
    phase: Phase;
    open: boolean;
    /** -1 = none */
    highlight: number;
    /** null = not probed yet */
    hasAccess: boolean | null;
    /** current datasource limit */
    limit: number;
}

export type Action =
    | { type: "focus" }
    | { type: "probeResult"; hasAccess: boolean }
    | { type: "type"; text: string; minChars: number }
    | { type: "searchDispatched"; pageSize: number }
    | { type: "resultsLoaded"; count: number }
    | { type: "showMore"; pageSize: number }
    | { type: "moveHighlight"; delta: number; count: number }
    | { type: "close"; clear: boolean }
    | { type: "select"; clear: boolean };

export const initialState = (): SearchState => ({
    text: "",
    phase: "idle",
    open: false,
    highlight: -1,
    hasAccess: null,
    limit: 0
});

export function reducer(s: SearchState, a: Action): SearchState {
    switch (a.type) {
        case "focus":
            if (s.hasAccess === null) {
                return { ...s, phase: "probing" };
            }
            if (s.hasAccess === false) {
                return { ...s, phase: "noAccess", open: true };
            }
            return s;
        case "probeResult":
            return a.hasAccess
                ? { ...s, hasAccess: true, phase: "idle", open: false }
                : { ...s, hasAccess: false, phase: "noAccess", open: true };
        case "type": {
            if (s.hasAccess === false) {
                return { ...s, text: a.text };
            }
            if (a.text.trim().length < a.minChars) {
                return { ...s, text: a.text, phase: "idle", open: false, highlight: -1 };
            }
            return { ...s, text: a.text, phase: "searching", open: true };
        }
        case "searchDispatched":
            return { ...s, limit: a.pageSize };
        case "resultsLoaded":
            if (a.count === 0) {
                return { ...s, phase: "empty", highlight: -1 };
            }
            return { ...s, phase: "results", highlight: s.highlight >= 0 && s.highlight < a.count ? s.highlight : 0 };
        case "showMore":
            return { ...s, limit: s.limit + a.pageSize };
        case "moveHighlight": {
            if (a.count === 0) {
                return { ...s, highlight: -1 };
            }
            const next = (s.highlight + a.delta + a.count) % a.count;
            return { ...s, highlight: next };
        }
        case "close":
        case "select":
            return a.clear
                ? { ...s, text: "", phase: "idle", open: false, highlight: -1, limit: 0 }
                : { ...s, open: false, highlight: -1 };
        default:
            return s;
    }
}
