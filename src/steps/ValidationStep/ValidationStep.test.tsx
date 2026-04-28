import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ValidationStep } from "./ValidationStep"
import type { Meta } from "./types"
import type { Data } from "../../types"
import { ErrorSources } from "../../types"

const mockUseRsi = vi.fn()
const mockOnSubmit = vi.fn()
const mockOnClose = vi.fn()
const mockToastCreate = vi.fn()
const mockAddErrorsAndRunHooks = vi.fn()
const baseUseRsiValue = {
  translations: {
    validationStep: {
      title: "Validate",
      discardButtonTitle: "Discard",
      filterSwitchTitle: "Filter",
      noRowsMessageWhenFiltered: "No errors",
      noRowsMessage: "No rows",
      nextButtonTitle: "Continue",
      backButtonTitle: "Back",
    },
    alerts: {
      submitError: { title: "Submit error", defaultMessage: "Failed to submit" },
    },
  },
  fields: [],
  onClose: mockOnClose,
  onSubmit: mockOnSubmit,
  rowHook: undefined,
  tableHook: undefined,
  onAsyncError: vi.fn(),
}

vi.mock("../../hooks/useRsi", () => ({
  useRsi: () => mockUseRsi(),
}))

vi.mock("../../components/Table", () => ({
  Table: ({
    rows,
    renderers,
    onSelectedRowsChange,
    onRowsChange,
  }: {
    rows: Array<{ __index: string; name?: string; __errors?: Record<string, { level: string }> | null }>
    renderers?: { noRowsFallback?: ReactNode }
    onSelectedRowsChange?: (selectedRows: ReadonlySet<string>) => void
    onRowsChange?: (nextRows: Array<{ __index: string; name?: string }>, changedData?: { indexes: number[] }) => void
  }) => (
    <div data-testid="table">
      <div data-testid="row-count">{rows.length}</div>
      <button onClick={() => onSelectedRowsChange?.(new Set(["2"]))}>select-row-2</button>
      <button
        onClick={() => {
          const nextRows = rows.map((row, idx) =>
            idx === 0 ? { ...row, name: `${row.name ?? ""}-edited` } : row,
          )
          onRowsChange?.(nextRows, { indexes: [0] })
        }}
      >
        edit-first-row
      </button>
      {rows.length === 0 ? renderers?.noRowsFallback : null}
    </div>
  ),
}))

vi.mock("../../components/ContinueButton", () => ({
  ContinueButton: ({ onContinue }: { onContinue: () => void }) => (
    <button onClick={onContinue}>continue</button>
  ),
}))

vi.mock("./components/columns", () => ({
  generateColumns: () => [],
}))

vi.mock("./utils/dataMutations", () => ({
  addErrorsAndRunHooks: (...args: unknown[]) => mockAddErrorsAndRunHooks(...args),
}))

vi.mock("../../lib/rsiToaster", () => ({
  rsiToaster: {
    create: (...args: unknown[]) => mockToastCreate(...args),
  },
}))

vi.mock("../../components/Alerts/SubmitDataAlert", () => ({
  SubmitDataAlert: ({
    isOpen,
    onConfirm,
    onClose,
  }: {
    isOpen: boolean
    onConfirm: () => void
    onClose: () => void
  }) =>
    isOpen ? (
      <>
        <button onClick={onConfirm}>confirm-submit</button>
        <button onClick={onClose}>close-submit-alert</button>
      </>
    ) : null,
}))

vi.mock("@chakra-ui/react", () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Button: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
  Heading: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  Dialog: {
    Body: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
  Switch: {
    Root: ({
      children,
      onCheckedChange,
    }: {
      children: ReactNode
      onCheckedChange?: (value: { checked: boolean }) => void
    }) => (
      <div>
        <button onClick={() => onCheckedChange?.({ checked: true })}>toggle-filter</button>
        {children}
      </div>
    ),
    HiddenInput: () => null,
    Control: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Thumb: () => null,
    Label: ({ children }: { children: ReactNode }) => <span>{children}</span>,
    Indicator: () => null,
  },
  Portal: ({ children }: { children: ReactNode }) => <>{children}</>,
  Spinner: () => null,
  Stack: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Toaster: ({ children }: { children: (toast: { type: string }) => ReactNode }) => (
    <div>{children({ type: "info" })}</div>
  ),
  Toast: {
    Root: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Indicator: () => null,
    Title: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Description: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    ActionTrigger: ({ children }: { children: ReactNode }) => <button>{children}</button>,
    CloseTrigger: () => <button>x</button>,
  },
  createToaster: () => ({ create: vi.fn() }),
}))

describe("ValidationStep", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockOnSubmit.mockResolvedValue(undefined)
    mockAddErrorsAndRunHooks.mockImplementation(
      async (rows: Array<Data<"name"> & Partial<Meta>>) =>
        rows.map((row) => ({
          ...(row as Data<"name">),
          __index: row.__index ?? "generated",
          __errors: row.__errors ?? null,
        })),
    )
    mockUseRsi.mockReturnValue(baseUseRsiValue)
  })

  it("submits validData, invalidData, and all payload sections", async () => {
    const file = new File(["x"], "import.csv")
    const initialData: (Data<"name"> & Meta)[] = [
      { __index: "1", name: "Alice" },
      {
        __index: "2",
        name: "Bob",
        __errors: {
          name: {
            source: ErrorSources.Row,
            level: "error",
            message: "Invalid name",
          },
        },
      },
    ]

    render(
      <ValidationStep
        file={file}
        initialData={initialData}
      />,
    )

    fireEvent.click(screen.getByText("continue"))
    fireEvent.click(await screen.findByText("confirm-submit"))

    await waitFor(() =>
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          validData: [{ name: "Alice" }],
          invalidData: [{ name: "Bob" }],
          all: [
            { __index: "1", name: "Alice" },
            {
              __index: "2",
              name: "Bob",
              __errors: {
                name: {
                  source: ErrorSources.Row,
                  level: "error",
                  message: "Invalid name",
                },
              },
            },
          ],
        },
        file,
      ),
    )
    expect(mockOnClose).toHaveBeenCalled()
  })

  it("submits immediately when there are no blocking errors", async () => {
    const file = new File(["x"], "import.csv")
    const initialData: (Data<"name"> & Meta)[] = [{ __index: "1", name: "Alice" }]
    render(<ValidationStep file={file} initialData={initialData} />)

    fireEvent.click(screen.getByText("continue"))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          validData: [{ name: "Alice" }],
          invalidData: [],
          all: [{ __index: "1", name: "Alice" }],
        },
        file,
      )
    })
    expect(screen.queryByText("confirm-submit")).not.toBeInTheDocument()
  })

  it("shows toast when submit fails", async () => {
    mockOnSubmit.mockRejectedValue(new Error("submit failed"))
    const file = new File(["x"], "import.csv")
    const initialData: (Data<"name"> & Meta)[] = [{ __index: "1", name: "Alice" }]
    render(<ValidationStep file={file} initialData={initialData} />)

    fireEvent.click(screen.getByText("continue"))

    await waitFor(() => {
      expect(mockToastCreate).toHaveBeenCalledWith(
        expect.objectContaining({ description: "submit failed" }),
      )
    })
  })

  it("filters to no rows when toggle is enabled and shows fallback", () => {
    const file = new File(["x"], "import.csv")
    const initialData: (Data<"name"> & Meta)[] = [{ __index: "1", name: "Alice" }]
    render(<ValidationStep file={file} initialData={initialData} />)

    expect(screen.getByTestId("row-count")).toHaveTextContent("1")
    fireEvent.click(screen.getByText("toggle-filter"))
    expect(screen.getByTestId("row-count")).toHaveTextContent("0")
    expect(screen.getByText("No errors")).toBeInTheDocument()
  })

  it("keeps only rows with error-level issues when filter is enabled", () => {
    const file = new File(["x"], "import.csv")
    const initialData: (Data<"name"> & Meta)[] = [
      {
        __index: "1",
        name: "WarningRow",
        __errors: {
          name: { source: ErrorSources.Row, level: "warning", message: "warn" },
        },
      },
      {
        __index: "2",
        name: "ErrorRow",
        __errors: {
          name: { source: ErrorSources.Row, level: "error", message: "err" },
        },
      },
    ]
    render(<ValidationStep file={file} initialData={initialData} />)

    fireEvent.click(screen.getByText("toggle-filter"))
    expect(screen.getByTestId("row-count")).toHaveTextContent("1")
  })

  it("discards selected rows and revalidates data", async () => {
    const file = new File(["x"], "import.csv")
    const initialData: (Data<"name"> & Meta)[] = [
      { __index: "1", name: "Alice" },
      { __index: "2", name: "Bob" },
    ]
    render(<ValidationStep file={file} initialData={initialData} />)

    fireEvent.click(screen.getByText("select-row-2"))
    fireEvent.click(screen.getByText("Discard"))

    await waitFor(() => {
      expect(mockAddErrorsAndRunHooks).toHaveBeenCalled()
      expect(screen.getByTestId("row-count")).toHaveTextContent("1")
    })
  })

  it("applies optimistic row updates when rowHook is async", async () => {
    mockUseRsi.mockReturnValue({
      ...baseUseRsiValue,
      rowHook: async (row: Data<"name">) => row,
    })
    const file = new File(["x"], "import.csv")
    const initialData: (Data<"name"> & Meta)[] = [{ __index: "1", name: "Alice" }]
    render(<ValidationStep file={file} initialData={initialData} />)

    fireEvent.click(screen.getByText("edit-first-row"))

    await waitFor(() =>
      expect(screen.getByTestId("row-count")).toHaveTextContent("1"),
    )
  })

  it("shows fallback toast when row update validation fails", async () => {
    mockAddErrorsAndRunHooks.mockRejectedValueOnce(new Error("update failed"))
    const file = new File(["x"], "import.csv")
    const initialData: (Data<"name"> & Meta)[] = [{ __index: "1", name: "Alice" }]
    render(<ValidationStep file={file} initialData={initialData} />)

    fireEvent.click(screen.getByText("edit-first-row"))

    await waitFor(() =>
      expect(mockToastCreate).toHaveBeenCalledWith(
        expect.objectContaining({ description: "Failed to submit" }),
      ),
    )
  })

  it("closes submit alert without submitting", async () => {
    const file = new File(["x"], "import.csv")
    const initialData: (Data<"name"> & Meta)[] = [
      {
        __index: "1",
        name: "Bad",
        __errors: {
          name: { source: ErrorSources.Row, level: "error", message: "bad" },
        },
      },
    ]
    render(<ValidationStep file={file} initialData={initialData} />)

    fireEvent.click(screen.getByText("continue"))
    expect(await screen.findByText("confirm-submit")).toBeInTheDocument()
    fireEvent.click(screen.getByText("close-submit-alert"))

    await waitFor(() =>
      expect(screen.queryByText("confirm-submit")).not.toBeInTheDocument(),
    )
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
})
