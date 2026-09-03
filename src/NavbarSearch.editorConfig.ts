import { NavbarSearchPreviewProps } from "../typings/NavbarSearchProps";

export interface Problem {
    property?: string;
    severity?: "error" | "warning";
    message: string;
}

export function check(values: NavbarSearchPreviewProps): Problem[] {
    const problems: Problem[] = [];
    if (!values.searchAttributes || values.searchAttributes.length === 0) {
        problems.push({
            property: "searchAttributes",
            severity: "error",
            message: "Add at least one search attribute."
        });
    }
    if (values.minChars === null || values.minChars < 1) {
        problems.push({ property: "minChars", severity: "error", message: "Minimum characters must be 1 or more." });
    }
    if (values.pageSize === null || values.pageSize < 1) {
        problems.push({ property: "pageSize", severity: "error", message: "Page size must be 1 or more." });
    }
    return problems;
}
