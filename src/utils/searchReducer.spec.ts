import { initialState, reducer } from "./searchReducer";

const s0 = initialState();

describe("searchReducer", () => {
    it("focus before probe enters probing", () => {
        expect(reducer(s0, { type: "focus" }).phase).toBe("probing");
    });
    it("probeResult false -> noAccess, open", () => {
        const s = reducer(reducer(s0, { type: "focus" }), { type: "probeResult", hasAccess: false });
        expect(s).toMatchObject({ phase: "noAccess", open: true, hasAccess: false });
    });
    it("probeResult true -> idle, closed", () => {
        const s = reducer(reducer(s0, { type: "focus" }), { type: "probeResult", hasAccess: true });
        expect(s).toMatchObject({ phase: "idle", open: false, hasAccess: true });
    });
    it("focus after a no-access probe reopens the placeholder", () => {
        const s = reducer({ ...s0, hasAccess: false }, { type: "focus" });
        expect(s).toMatchObject({ phase: "noAccess", open: true });
    });
    it("typing under minChars stays idle and closes", () => {
        const s = reducer({ ...s0, hasAccess: true, open: true }, { type: "type", text: "j", minChars: 2 });
        expect(s).toMatchObject({ text: "j", phase: "idle", open: false, highlight: -1 });
    });
    it("typing at minChars enters searching and opens", () => {
        const s = reducer({ ...s0, hasAccess: true }, { type: "type", text: "jo", minChars: 2 });
        expect(s).toMatchObject({ phase: "searching", open: true });
    });
    it("typing with no access stays noAccess", () => {
        const s = reducer(
            { ...s0, hasAccess: false, phase: "noAccess", open: true },
            { type: "type", text: "jo", minChars: 2 }
        );
        expect(s.phase).toBe("noAccess");
    });
    it("searchDispatched sets limit to pageSize", () => {
        expect(reducer({ ...s0, phase: "searching" }, { type: "searchDispatched", pageSize: 20 }).limit).toBe(20);
    });
    it("resultsLoaded 0 -> empty, >0 -> results with highlight 0", () => {
        expect(reducer({ ...s0, phase: "searching" }, { type: "resultsLoaded", count: 0 }).phase).toBe("empty");
        expect(reducer({ ...s0, phase: "searching" }, { type: "resultsLoaded", count: 3 })).toMatchObject({
            phase: "results",
            highlight: 0
        });
    });
    it("resultsLoaded keeps an in-range highlight", () => {
        expect(reducer({ ...s0, phase: "results", highlight: 2 }, { type: "resultsLoaded", count: 5 }).highlight).toBe(
            2
        );
    });
    it("resultsLoaded marks loaded; close with clear resets it", () => {
        const loaded = reducer({ ...s0, phase: "searching" }, { type: "resultsLoaded", count: 2 });
        expect(loaded.loaded).toBe(true);
        expect(reducer(loaded, { type: "close", clear: true }).loaded).toBe(false);
        expect(reducer(loaded, { type: "type", text: "j", minChars: 2 }).loaded).toBe(false);
    });
    it("showMore adds a page", () => {
        expect(reducer({ ...s0, limit: 20 }, { type: "showMore", pageSize: 20 }).limit).toBe(40);
    });
    it("moveHighlight wraps", () => {
        expect(reducer({ ...s0, highlight: 2 }, { type: "moveHighlight", delta: 1, count: 3 }).highlight).toBe(0);
        expect(reducer({ ...s0, highlight: 0 }, { type: "moveHighlight", delta: -1, count: 3 }).highlight).toBe(2);
    });
    it("close with clear resets text and goes idle", () => {
        const s = reducer(
            { ...s0, text: "jo", phase: "results", open: true, hasAccess: true, limit: 20 },
            { type: "close", clear: true }
        );
        expect(s).toMatchObject({ text: "", phase: "idle", open: false, highlight: -1, limit: 0, hasAccess: true });
    });
    it("close without clear keeps text", () => {
        const s = reducer({ ...s0, text: "jo", phase: "results", open: true }, { type: "close", clear: false });
        expect(s).toMatchObject({ text: "jo", open: false, phase: "results" });
    });
    it("select behaves like close", () => {
        const s = reducer({ ...s0, text: "jo", phase: "results", open: true }, { type: "select", clear: true });
        expect(s).toMatchObject({ text: "", phase: "idle", open: false });
    });
});
