/**
 * This file was generated from NavbarSearch.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { DynamicValue, ListActionValue, ListAttributeValue, ListValue, ListWidgetValue } from "mendix";
import { ComponentType, CSSProperties, ReactNode } from "react";

export interface SearchAttributesType {
    attribute: ListAttributeValue<string>;
}

export interface SearchAttributesPreviewType {
    attribute: string;
}

export interface NavbarSearchContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    dataSource: ListValue;
    searchAttributes: SearchAttributesType[];
    rowContent: ListWidgetValue;
    onRowClick?: ListActionValue;
    placeholder?: DynamicValue<string>;
    noResultsContent?: ReactNode;
    noAccessContent?: ReactNode;
    showMoreCaption?: DynamicValue<string>;
    minChars: number;
    debounceMs: number;
    pageSize: number;
    clearOnSelect: boolean;
    closeOnOutsideClick: boolean;
}

export interface NavbarSearchPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    dataSource: {} | { caption: string } | { type: string } | null;
    searchAttributes: SearchAttributesPreviewType[];
    rowContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    onRowClick: {} | null;
    placeholder: string;
    noResultsContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    noAccessContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    showMoreCaption: string;
    minChars: number | null;
    debounceMs: number | null;
    pageSize: number | null;
    clearOnSelect: boolean;
    closeOnOutsideClick: boolean;
}
