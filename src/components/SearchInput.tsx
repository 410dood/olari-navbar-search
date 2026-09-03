import { ChangeEvent, KeyboardEvent, ReactElement } from "react";

interface Props {
    id: string;
    value: string;
    placeholder: string;
    expanded: boolean;
    listboxId: string;
    activeId?: string;
    disabled: boolean;
    tabIndex?: number;
    onFocus: () => void;
    onChange: (text: string) => void;
    onKeyDown: (e: KeyboardEvent) => void;
}

export function SearchInput(p: Props): ReactElement {
    return (
        <div className="olari-navbar-search__field">
            <span className="olari-navbar-search__icon" aria-hidden="true" />
            <input
                id={p.id}
                className="olari-navbar-search__input form-control"
                type="text"
                role="combobox"
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={p.expanded}
                aria-controls={p.listboxId}
                aria-activedescendant={p.activeId}
                placeholder={p.placeholder}
                value={p.value}
                disabled={p.disabled}
                tabIndex={p.tabIndex}
                onFocus={p.onFocus}
                onChange={(e: ChangeEvent<HTMLInputElement>) => p.onChange(e.target.value)}
                onKeyDown={p.onKeyDown}
            />
        </div>
    );
}
