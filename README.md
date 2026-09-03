# Navbar Search (olari.NavbarSearch)

Mendix pluggable web widget (React client, Mendix 10.21+/11) for a header or page search box that:

- takes **any list data source** (entity or view entity; Database and XPath sources filter on the server)
- searches **any number of string attributes**; every typed word must match at least one attribute (`contains`)
- renders each result through a **widgets content slot**, so rows are laid out in Studio Pro
- fires an **On row click** action with the clicked row object (no helper entity, no selection to write)
- shows two distinct placeholders: **no results** for a search that matched nothing, and **no access** when the data source returns no rows at all for the current user
- is cheap: nothing loads on page mount, a 1-row probe on first focus, debounced server-side filter, page-size limit with **Show more**
- keyboard: Up/Down highlight, Enter selects, Escape closes, outside click closes

## Properties

| Group | Property | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| Data source | Data source | list | required | Any entity or view entity |
| Data source | Search attributes | list of attribute | required | String attributes; calculated attributes unsupported |
| Data source | Row content | widgets | required | Rendered per row, bound to the row object |
| Events | On row click | action | | Receives the row object |
| Texts | Placeholder | text template | `Search…` | |
| Texts | No results content | widgets | | Fallback text: "No results" |
| Texts | No access content | widgets | | Fallback text: "No records are available to you" |
| Texts | Show more caption | text template | `Show more` | |
| Behavior | Minimum characters | integer | 2 | |
| Behavior | Debounce (ms) | integer | 300 | |
| Behavior | Page size | integer | 20 | Show more adds another page |
| Behavior | Clear on select | boolean | true | Also clears on Escape / outside click |
| Behavior | Close on outside click | boolean | true | |

## Behavior

1. **Mount**: data source limit is set to 0, so no rows are requested.
2. **First focus**: an unfiltered request with limit 1 is sent. Zero rows means the user cannot see anything in this data source; the dropdown opens with the *no access* content and typing does not query. The answer is cached until the page is left.
3. **Typing**: once the text reaches *Minimum characters*, after the debounce the widget builds `AND(token1 OR-over-attributes, token2 OR-over-attributes, …)` with `mendix/filters/builders` and calls `setFilter` + `setLimit(pageSize)`. Previous rows stay visible while the next page loads.
4. **Results**: rows render via *Row content*. If the data source reports more rows, a *Show more* footer raises the limit by one page.
5. **Select**: click or Enter runs *On row click* with the row, then clears and closes (when *Clear on select* is on).

Security is entirely the data source's: point it at a view entity with its own scoping, or an entity with access rules, and the probe reflects exactly what the user may see.

## Styling hooks

BEM classes on the widget, no visual theme baked in beyond a minimal dropdown:

`.olari-navbar-search`, `--open`, `__field`, `__icon`, `__input`, `__dropdown`, `__list`, `__row`, `__row--active`, `__footer`, `__empty`, `__loading`.

## Example: Olari top header

- Data source: Database, `Az_ClientManagement.VW_ClientOverview` (self-constraining view)
- Search attributes: FirstName, LastName, FullName
- Row content: photo thumbnail, `{FirstName} {LastName}`, DOB / MRN line
- On row click: microflow taking the view object, resolving the Client and calling `ACT_Client_Edit`

## Development

```
npm install
npm test          # jest unit tests (tokenize, buildFilter, searchReducer)
npm run lint
npm run build     # dist/<version>/olari.NavbarSearch.mpk
npm run release   # minified release build
```

Copy the mpk into your app's `widgets/` folder and synchronize Studio Pro with the file system (F4).

## License

MIT
