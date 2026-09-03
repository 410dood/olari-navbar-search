import { KeyboardEvent, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef } from "react";
import { ListAttributeValue, ListValue, ObjectItem } from "mendix";
import { buildFilter } from "../utils/buildFilter";
import { tokenize } from "../utils/tokenize";
import { initialState, reducer, SearchState } from "../utils/searchReducer";

export interface UseNavbarSearchArgs {
    dataSource: ListValue;
    attributes: Array<ListAttributeValue<string>>;
    minChars: number;
    debounceMs: number;
    pageSize: number;
    clearOnSelect: boolean;
    /** Invoked with the row object when a row is clicked or chosen with Enter. */
    onSelectItem: (item: ObjectItem) => void;
}

export interface UseNavbarSearch {
    state: SearchState;
    items: ObjectItem[];
    loading: boolean;
    hasMore: boolean;
    onFocus: () => void;
    onChange: (text: string) => void;
    onKeyDown: (e: KeyboardEvent) => void;
    onShowMore: () => void;
    close: () => void;
    select: (item: ObjectItem) => void;
}

export function useNavbarSearch(args: UseNavbarSearchArgs): UseNavbarSearch {
    const { dataSource, attributes, minChars, debounceMs, pageSize, clearOnSelect, onSelectItem } = args;
    const [state, dispatch] = useReducer(reducer, undefined, initialState);
    const debounceRef = useRef<number | undefined>(undefined);
    // > 0 while the datasource is serving a search request (as opposed to the probe or the initial mount).
    const searchRequestRef = useRef(0);

    const resetDataSource = useCallback(() => {
        searchRequestRef.current = 0;
        pendingRef.current = null;
        dataSource.setFilter(undefined);
        dataSource.setLimit(0);
    }, [dataSource]);

    // Never let the datasource load rows on mount.
    useLayoutEffect(() => {
        dataSource.setLimit(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // A request is "pending" from the moment we call setFilter/setLimit until the datasource hands us a NEW
    // response. The old props (status "available", stale items) are still there when the effects below first run,
    // so we only consume once we have seen a loading status or a different items array than at request time.
    const pendingRef = useRef<{ itemsAtRequest: ObjectItem[] | undefined; sawLoading: boolean } | null>(null);
    const markRequest = useCallback(() => {
        pendingRef.current = { itemsAtRequest: dataSource.items, sawLoading: false };
    }, [dataSource]);

    // Probe: unfiltered, limit 1.
    useEffect(() => {
        if (state.phase !== "probing") {
            return;
        }
        markRequest();
        dataSource.setFilter(undefined);
        dataSource.setLimit(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.phase]);

    // Consume datasource results.
    useEffect(() => {
        const pending = pendingRef.current;
        if (!pending) {
            return;
        }
        if (dataSource.status === "loading") {
            pendingRef.current = { ...pending, sawLoading: true };
            return;
        }
        if (dataSource.status !== "available" || !dataSource.items) {
            return;
        }
        if (!pending.sawLoading && dataSource.items === pending.itemsAtRequest) {
            return; // still the stale response from before the request
        }
        pendingRef.current = null;
        if (state.phase === "probing") {
            dispatch({ type: "probeResult", hasAccess: dataSource.items.length > 0 });
            dataSource.setLimit(0);
            return;
        }
        const searchPhase = state.phase === "searching" || state.phase === "results" || state.phase === "empty";
        if (searchPhase && searchRequestRef.current > 0) {
            dispatch({ type: "resultsLoaded", count: dataSource.items.length });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSource.status, dataSource.items, state.phase]);

    const runSearch = useCallback(
        (text: string) => {
            const filter = buildFilter(tokenize(text), attributes);
            searchRequestRef.current += 1;
            markRequest();
            dataSource.setFilter(filter);
            dataSource.setLimit(pageSize);
            dispatch({ type: "searchDispatched", pageSize });
        },
        [attributes, dataSource, markRequest, pageSize]
    );

    const onChange = useCallback(
        (text: string) => {
            dispatch({ type: "type", text, minChars });
            window.clearTimeout(debounceRef.current);
            if (state.hasAccess === false) {
                return;
            }
            if (text.trim().length < minChars) {
                resetDataSource();
                return;
            }
            debounceRef.current = window.setTimeout(() => runSearch(text), debounceMs);
        },
        [debounceMs, minChars, resetDataSource, runSearch, state.hasAccess]
    );

    const close = useCallback(() => {
        window.clearTimeout(debounceRef.current);
        dispatch({ type: "close", clear: clearOnSelect });
        if (clearOnSelect) {
            resetDataSource();
        }
    }, [clearOnSelect, resetDataSource]);

    const select = useCallback(
        (item: ObjectItem) => {
            window.clearTimeout(debounceRef.current);
            dispatch({ type: "select", clear: clearOnSelect });
            if (clearOnSelect) {
                resetDataSource();
            }
            onSelectItem(item);
        },
        [clearOnSelect, onSelectItem, resetDataSource]
    );

    const onShowMore = useCallback(() => {
        dispatch({ type: "showMore", pageSize });
        markRequest();
        dataSource.setLimit(state.limit + pageSize);
    }, [dataSource, markRequest, pageSize, state.limit]);

    const items = useMemo(() => (state.loaded ? dataSource.items ?? [] : []), [state.loaded, dataSource.items]);
    const loading = state.open && (state.phase === "searching" || dataSource.status === "loading");
    const hasMore = !!dataSource.hasMoreItems;

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                close();
                return;
            }
            if (!state.open) {
                return;
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                dispatch({ type: "moveHighlight", delta: 1, count: items.length });
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                dispatch({ type: "moveHighlight", delta: -1, count: items.length });
            } else if (e.key === "Enter") {
                e.preventDefault();
                const idx = state.highlight >= 0 ? state.highlight : 0;
                if (items[idx]) {
                    select(items[idx]);
                }
            } else if (e.key === "Tab") {
                close();
            }
        },
        [close, items, select, state.highlight, state.open]
    );

    useEffect(() => () => window.clearTimeout(debounceRef.current), []);

    const onFocus = useCallback(() => dispatch({ type: "focus" }), []);

    return { state, items, loading, hasMore, onFocus, onChange, onKeyDown, onShowMore, close, select };
}
