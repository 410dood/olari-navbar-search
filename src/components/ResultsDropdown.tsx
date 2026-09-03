import { MouseEvent, ReactElement, ReactNode } from "react";
import classNames from "classnames";
import { ObjectItem } from "mendix";
import { Phase } from "../utils/searchReducer";

interface Props {
    listboxId: string;
    phase: Phase;
    items: ObjectItem[];
    highlight: number;
    loading: boolean;
    hasMore: boolean;
    showMoreCaption: string;
    renderRow: (item: ObjectItem) => ReactNode;
    noResults: ReactNode;
    noAccess: ReactNode;
    onSelect: (item: ObjectItem) => void;
    onShowMore: () => void;
}

// Keep focus in the input when rows / footer are clicked.
const keepFocus = (e: MouseEvent): void => e.preventDefault();

export function ResultsDropdown(p: Props): ReactElement {
    return (
        <div className="olari-navbar-search__dropdown">
            {p.loading && (
                <div className="olari-navbar-search__loading" aria-live="polite">
                    Loading…
                </div>
            )}
            {p.phase === "noAccess" && <div className="olari-navbar-search__empty">{p.noAccess}</div>}
            {p.phase === "empty" && <div className="olari-navbar-search__empty">{p.noResults}</div>}
            {p.items.length > 0 && (
                <ul id={p.listboxId} role="listbox" className="olari-navbar-search__list">
                    {p.items.map((item, i) => (
                        <li
                            key={item.id}
                            id={`${p.listboxId}-${i}`}
                            role="option"
                            aria-selected={i === p.highlight}
                            className={classNames("olari-navbar-search__row", {
                                "olari-navbar-search__row--active": i === p.highlight
                            })}
                            onMouseDown={keepFocus}
                            onClick={() => p.onSelect(item)}
                        >
                            {p.renderRow(item)}
                        </li>
                    ))}
                </ul>
            )}
            {p.hasMore && p.items.length > 0 && (
                <button
                    type="button"
                    className="olari-navbar-search__footer btn btn-link"
                    onMouseDown={keepFocus}
                    onClick={p.onShowMore}
                >
                    {p.showMoreCaption}
                </button>
            )}
        </div>
    );
}
