import { ReactElement, useCallback, useId, useMemo, useRef } from "react";
import classNames from "classnames";
import { ObjectItem } from "mendix";
import { NavbarSearchContainerProps } from "../typings/NavbarSearchProps";
import { useNavbarSearch } from "./hooks/useNavbarSearch";
import { useOutsideClick } from "./hooks/useOutsideClick";
import { SearchInput } from "./components/SearchInput";
import { ResultsDropdown } from "./components/ResultsDropdown";
import "./ui/NavbarSearch.scss";

const DEFAULT_NO_RESULTS = "No results";
const DEFAULT_NO_ACCESS = "No records are available to you";

export default function NavbarSearch(props: NavbarSearchContainerProps): ReactElement {
    const rootRef = useRef<HTMLDivElement>(null);
    const id = useId();
    const listboxId = `${id}-listbox`;
    const attributes = useMemo(() => props.searchAttributes.map(s => s.attribute), [props.searchAttributes]);

    const { onRowClick } = props;
    const onSelectItem = useCallback(
        (item: ObjectItem) => {
            const action = onRowClick?.get(item);
            if (action?.canExecute) {
                action.execute();
            }
        },
        [onRowClick]
    );

    const search = useNavbarSearch({
        dataSource: props.dataSource,
        attributes,
        minChars: props.minChars,
        debounceMs: props.debounceMs,
        pageSize: props.pageSize,
        clearOnSelect: props.clearOnSelect,
        onSelectItem
    });

    const { close } = search;
    const onOutside = useCallback(() => close(), [close]);
    useOutsideClick(rootRef, props.closeOnOutsideClick && search.state.open, onOutside);

    const unavailable = props.dataSource.status === "unavailable";
    const activeId = search.state.highlight >= 0 ? `${listboxId}-${search.state.highlight}` : undefined;

    return (
        <div
            ref={rootRef}
            className={classNames("olari-navbar-search", props.class, {
                "olari-navbar-search--open": search.state.open
            })}
            style={props.style}
        >
            <SearchInput
                id={`${id}-input`}
                value={search.state.text}
                placeholder={props.placeholder?.value ?? ""}
                expanded={search.state.open}
                listboxId={listboxId}
                activeId={activeId}
                disabled={unavailable}
                tabIndex={props.tabIndex}
                onFocus={search.onFocus}
                onChange={search.onChange}
                onKeyDown={search.onKeyDown}
            />
            {search.state.open && (
                <ResultsDropdown
                    listboxId={listboxId}
                    phase={search.state.phase}
                    items={search.items}
                    highlight={search.state.highlight}
                    loading={search.loading}
                    hasMore={search.hasMore}
                    showMoreCaption={props.showMoreCaption?.value ?? "Show more"}
                    renderRow={item => props.rowContent.get(item)}
                    noResults={props.noResultsContent ?? DEFAULT_NO_RESULTS}
                    noAccess={props.noAccessContent ?? DEFAULT_NO_ACCESS}
                    onSelect={search.select}
                    onShowMore={search.onShowMore}
                />
            )}
        </div>
    );
}
