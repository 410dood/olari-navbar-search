import { FilterCondition } from "mendix/filters";
import { and, attribute, contains, literal, or } from "mendix/filters/builders";
import { ListAttributeValue } from "mendix";

/**
 * Every token must match at least one attribute (AND over tokens of OR over attributes).
 * Single token / single attribute collapse to the bare `contains`.
 */
export function buildFilter(tokens: string[], attrs: Array<ListAttributeValue<string>>): FilterCondition | undefined {
    if (tokens.length === 0 || attrs.length === 0) {
        return undefined;
    }
    const perToken = tokens.map(token => {
        const conds = attrs.map(a => contains(attribute(a.id), literal(token)));
        return conds.length === 1 ? conds[0] : or(...conds);
    });
    return perToken.length === 1 ? perToken[0] : and(...perToken);
}
