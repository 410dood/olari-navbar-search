import { ReactElement } from "react";
import { NavbarSearchPreviewProps } from "../typings/NavbarSearchProps";

export function preview(props: NavbarSearchPreviewProps): ReactElement {
    return (
        <div className="olari-navbar-search olari-navbar-search--preview">
            <div className="olari-navbar-search__field">
                <span className="olari-navbar-search__icon" aria-hidden="true" />
                <input
                    className="olari-navbar-search__input form-control"
                    readOnly
                    value=""
                    placeholder={props.placeholder || "Search…"}
                />
            </div>
            <div className="olari-navbar-search__dropdown">
                <props.rowContent.renderer caption="Row content">
                    <div />
                </props.rowContent.renderer>
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/NavbarSearch.scss");
}
