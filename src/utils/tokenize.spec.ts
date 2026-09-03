import { tokenize } from "./tokenize";

describe("tokenize", () => {
    it("splits on whitespace and trims", () => {
        expect(tokenize("  jo   smi ")).toEqual(["jo", "smi"]);
    });
    it("returns [] for blank", () => {
        expect(tokenize("   ")).toEqual([]);
        expect(tokenize("")).toEqual([]);
    });
    it("de-duplicates tokens case-insensitively", () => {
        expect(tokenize("Jo jo")).toEqual(["Jo"]);
    });
});
