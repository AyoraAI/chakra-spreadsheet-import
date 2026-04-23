# chakra-spreadsheet-import

Import flow for Excel (`.xlsx`, `.xls`) and CSV with automated column matching and validation, built with **Chakra UI v3**.

Derived from [UgnisSoftware/react-spreadsheet-import](https://github.com/UgnisSoftware/react-spreadsheet-import) (MIT). This package contains a maintained fork with Chakra 3, an internal toast surface, and no dependency on a host app’s path aliases.

## License

See [LICENSE](./LICENSE) (MIT; includes upstream UGNIS copyright and a line for this fork’s modifications).

## Install (git; no npm registry)

With Yarn or pnpm, depend on a **tag** or **commit** of your public GitHub repository:

```json
{
  "dependencies": {
    "chakra-spreadsheet-import": "github:AyoraAI/chakra-spreadsheet-import#v0.1.0"
  }
}
```

Then install peer dependencies in the host app (match your versions as needed):

- `react`, `react-dom`
- `@chakra-ui/react`, `@emotion/react`

## Usage

```tsx
import { ReactSpreadsheetImport } from "chakra-spreadsheet-import"
import "chakra-spreadsheet-import/index.css"

function App() {
  return (
    <ReactSpreadsheetImport
      isOpen={open}
      onClose={() => setOpen(false)}
      onSubmit={async (data, file) => { /* ... */ }}
      fields={fields}
      onAsyncError={(err) => {
        // optional: forward to Sentry, etc.
        console.error(err)
      }}
    />
  )
}
```

The root component mounts its own Chakra toasts for in-flow errors; you do not need to register a global toaster for this flow.

## Build (maintainers)

From this package directory:

```bash
yarn build
```

This repository **commits `dist/`** for `github:…#tag` installs: `prepack` runs on `npm pack` / publish, but a normal git dependency install does not run it. If you ever stop committing `dist/`, add a `prepare` script (or document that every consumer must build the package).

The published tag [`v0.1.0`](https://github.com/AyoraAI/chakra-spreadsheet-import/releases/tag/v0.1.0) should match the `version` field in `package.json`.
