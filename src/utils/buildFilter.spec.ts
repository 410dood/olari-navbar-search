import { and, attribute, contains, literal, or } from "mendix/filters/builders";
import { ListAttributeValue } from "mendix";
type ListAttributeId = ListAttributeValue<string>["id"];
import { buildFilter } from "./buildFilter";

const attr = (id: string): ListAttributeValue<string> => ({ id } as unknown as ListAttributeValue<string>);
const aid = (id: string): ListAttributeId => id as unknown as ListAttributeId;

describe("buildFilter", () => {
    it("returns undefined for no tokens or no attributes", () => {
        expect(buildFilter([], [attr("a")])).toBeUndefined();
        expect(buildFilter(["x"], [])).toBeUndefined();
    });
    it("collapses single token + single attribute to a bare contains", () => {
        expect(buildFilter(["jo"], [attr("a")])).toEqual(contains(attribute(aid("a")), literal("jo")));
    });
    it("ORs attributes for one token", () => {
        expect(buildFilter(["jo"], [attr("a"), attr("b")])).toEqual(
            or(contains(attribute(aid("a")), literal("jo")), contains(attribute(aid("b")), literal("jo")))
        );
    });
    it("ANDs tokens, each ORed over attributes", () => {
        expect(buildFilter(["jo", "smi"], [attr("a"), attr("b")])).toEqual(
            and(
                or(contains(attribute(aid("a")), literal("jo")), contains(attribute(aid("b")), literal("jo"))),
                or(contains(attribute(aid("a")), literal("smi")), contains(attribute(aid("b")), literal("smi")))
            )
        );
    });
});
