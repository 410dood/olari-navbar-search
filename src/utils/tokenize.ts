export function tokenize(text: string): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of text.trim().split(/\s+/)) {
        if (!raw) {
            continue;
        }
        const key = raw.toLowerCase();
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        out.push(raw);
    }
    return out;
}
