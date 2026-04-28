import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { StepType, UploadFlow } from "./UploadFlow"

const mockUseRsi = vi.fn()
const mockMapWorkbook = vi.fn()
const mockAddErrorsAndRunHooks = vi.fn()
const mockUploadStepHook = vi.fn()
const mockSelectHeaderStepHook = vi.fn()
const mockMatchColumnsStepHook = vi.fn()
const mockExceedsMaxRecords = vi.fn()
const mockToastCreate = vi.fn()
let uploadWorkbook: { SheetNames: string[]; Sheets: Record<string, unknown> }

vi.mock("../hooks/useRsi", () => ({
  useRsi: () => mockUseRsi(),
}))

vi.mock("../utils/mapWorkbook", () => ({
  mapWorkbook: (...args: unknown[]) => mockMapWorkbook(...args),
}))

vi.mock("./ValidationStep/utils/dataMutations", () => ({
  addErrorsAndRunHooks: (...args: unknown[]) => mockAddErrorsAndRunHooks(...args),
}))

vi.mock("../utils/exceedsMaxRecords", () => ({
  exceedsMaxRecords: (...args: unknown[]) => mockExceedsMaxRecords(...args),
}))

vi.mock("../lib/rsiToaster", () => ({
  rsiToaster: {
    create: (...args: unknown[]) => mockToastCreate(...args),
  },
}))

vi.mock("./UploadStep/UploadStep", () => ({
  UploadStep: ({ onContinue }: { onContinue: (workbook: unknown, file: File) => void }) => (
    <button onClick={() => onContinue(uploadWorkbook, new File(["content"], "upload.csv"))}>
      upload-continue
    </button>
  ),
}))

vi.mock("./SelectSheetStep/SelectSheetStep", () => ({
  SelectSheetStep: ({
    onContinue,
  }: {
    onContinue: (sheetName: string) => void
  }) => <button onClick={() => onContinue("Sheet2")}>select-sheet-continue</button>,
}))

vi.mock("./SelectHeaderStep/SelectHeaderStep", () => ({
  SelectHeaderStep: ({
    onContinue,
  }: {
    onContinue: (headerValues: string[], data: string[][]) => void
  }) => (
    <button onClick={() => onContinue(["name", "email"], [["A", "a@example.com"]])}>
      select-header-continue
    </button>
  ),
}))

vi.mock("./MatchColumnsStep/MatchColumnsStep", () => ({
  MatchColumnsStep: ({
    onContinue,
  }: {
    onContinue: (values: unknown, rawData: string[][], columns: unknown[]) => void
  }) => (
    <button
      onClick={() => onContinue([{ name: "A" }], [["A"]], [{ index: 0, header: "name" }])}
    >
      match-columns-continue
    </button>
  ),
}))

vi.mock("./ValidationStep/ValidationStep", () => ({
  ValidationStep: ({ file }: { file: File }) => (
    <div data-testid="validation-step">{file.name}</div>
  ),
}))

const baseRsiValue = {
  maxRecords: undefined,
  translations: {
    alerts: { toast: { error: "Error" } },
    uploadStep: {
      maxRecordsExceeded: (max: string) => `Max ${max}`,
    },
  },
  uploadStepHook: mockUploadStepHook,
  selectHeaderStepHook: mockSelectHeaderStepHook,
  matchColumnsStepHook: mockMatchColumnsStepHook,
  fields: [{ key: "name", label: "Name", fieldType: { type: "input" } }],
  rowHook: undefined,
  tableHook: undefined,
  onAsyncError: vi.fn(),
}

describe("UploadFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockExceedsMaxRecords.mockReturnValue(false)
    uploadWorkbook = {
      SheetNames: ["Sheet1"],
      Sheets: { Sheet1: { "!ref": "A1:B2" } },
    }
    mockMapWorkbook.mockReturnValue([["mapped"]])
    mockUploadStepHook.mockResolvedValue([["uploaded"]])
    mockSelectHeaderStepHook.mockResolvedValue({
      headerValues: ["name"],
      data: [["A"]],
    })
    mockMatchColumnsStepHook.mockResolvedValue([{ name: "A" }])
    mockAddErrorsAndRunHooks.mockResolvedValue([{ name: "A", __index: "idx-1" }])
    mockUseRsi.mockReturnValue(baseRsiValue)
  })

  it("routes single-sheet uploads directly to selectHeader", async () => {
    const onNext = vi.fn()
    render(<UploadFlow state={{ type: StepType.upload }} onNext={onNext} />)

    fireEvent.click(screen.getByText("upload-continue"))

    await waitFor(() =>
      expect(onNext).toHaveBeenCalledWith({
        type: StepType.selectHeader,
        data: [["uploaded"]],
      }),
    )
  })

  it("routes multi-sheet uploads to selectSheet", async () => {
    uploadWorkbook = {
      SheetNames: ["Sheet1", "Sheet2"],
      Sheets: { Sheet1: { "!ref": "A1:B2" }, Sheet2: { "!ref": "A1:B2" } },
    }
    const onNext = vi.fn()
    render(<UploadFlow state={{ type: StepType.upload }} onNext={onNext} />)

    fireEvent.click(screen.getByText("upload-continue"))

    await waitFor(() =>
      expect(onNext).toHaveBeenCalledWith({
        type: StepType.selectSheet,
        workbook: uploadWorkbook,
      }),
    )
  })

  it("passes header selection output to match columns step", async () => {
    const onNext = vi.fn()
    render(
      <UploadFlow
        state={{ type: StepType.selectHeader, data: [["A"]] }}
        onNext={onNext}
      />,
    )

    fireEvent.click(screen.getByText("select-header-continue"))

    await waitFor(() =>
      expect(onNext).toHaveBeenCalledWith({
        type: StepType.matchColumns,
        data: [["A"]],
        headerValues: ["name"],
      }),
    )
  })

  it("moves from match columns to validation with enriched data", async () => {
    const onNext = vi.fn()
    render(
      <UploadFlow
        state={{
          type: StepType.matchColumns,
          data: [["A"]],
          headerValues: ["name"],
        }}
        onNext={onNext}
      />,
    )

    fireEvent.click(screen.getByText("match-columns-continue"))

    await waitFor(() =>
      expect(onNext).toHaveBeenCalledWith({
        type: StepType.validateData,
        data: [{ name: "A", __index: "idx-1" }],
      }),
    )
    expect(mockMatchColumnsStepHook).toHaveBeenCalled()
    expect(mockAddErrorsAndRunHooks).toHaveBeenCalled()
  })

  it("shows max-records toast and stops single-sheet flow when exceeded", async () => {
    mockUseRsi.mockReturnValue({
      ...baseRsiValue,
      maxRecords: 1,
    })
    mockExceedsMaxRecords.mockReturnValue(true)
    const onNext = vi.fn()
    render(<UploadFlow state={{ type: StepType.upload }} onNext={onNext} />)

    fireEvent.click(screen.getByText("upload-continue"))

    await waitFor(() => {
      expect(mockToastCreate).toHaveBeenCalled()
      expect(onNext).not.toHaveBeenCalled()
    })
  })

  it("shows max-records toast and stops selected-sheet flow when exceeded", async () => {
    mockUseRsi.mockReturnValue({
      ...baseRsiValue,
      maxRecords: 1,
    })
    mockExceedsMaxRecords.mockReturnValue(true)
    const onNext = vi.fn()
    render(
      <UploadFlow
        state={{
          type: StepType.selectSheet,
          workbook: {
            SheetNames: ["Sheet1", "Sheet2"],
            Sheets: { Sheet1: { "!ref": "A1:B2" }, Sheet2: { "!ref": "A1:B2" } },
          },
        }}
        onNext={onNext}
      />,
    )

    fireEvent.click(screen.getByText("select-sheet-continue"))

    await waitFor(() => {
      expect(mockToastCreate).toHaveBeenCalled()
      expect(onNext).not.toHaveBeenCalled()
    })
  })

  it("toasts upload step hook errors", async () => {
    mockUploadStepHook.mockRejectedValue(new Error("upload failed"))
    const onNext = vi.fn()
    render(<UploadFlow state={{ type: StepType.upload }} onNext={onNext} />)

    fireEvent.click(screen.getByText("upload-continue"))

    await waitFor(() => {
      expect(mockToastCreate).toHaveBeenCalledWith(
        expect.objectContaining({ description: "upload failed" }),
      )
      expect(onNext).not.toHaveBeenCalled()
    })
  })

  it("toasts select header hook errors", async () => {
    mockSelectHeaderStepHook.mockRejectedValue(new Error("header failed"))
    const onNext = vi.fn()
    render(
      <UploadFlow
        state={{ type: StepType.selectHeader, data: [["A"]] }}
        onNext={onNext}
      />,
    )

    fireEvent.click(screen.getByText("select-header-continue"))

    await waitFor(() => {
      expect(mockToastCreate).toHaveBeenCalledWith(
        expect.objectContaining({ description: "header failed" }),
      )
      expect(onNext).not.toHaveBeenCalled()
    })
  })

  it("maps selected sheet and proceeds to selectHeader", async () => {
    const onNext = vi.fn()
    render(
      <UploadFlow
        state={{
          type: StepType.selectSheet,
          workbook: {
            SheetNames: ["Sheet1", "Sheet2"],
            Sheets: { Sheet1: { "!ref": "A1:B2" }, Sheet2: { "!ref": "A1:B2" } },
          },
        }}
        onNext={onNext}
      />,
    )

    fireEvent.click(screen.getByText("select-sheet-continue"))

    await waitFor(() =>
      expect(onNext).toHaveBeenCalledWith({
        type: StepType.selectHeader,
        data: [["uploaded"]],
      }),
    )
  })

  it("toasts selected-sheet upload errors", async () => {
    mockUploadStepHook.mockRejectedValue(new Error("selected sheet failed"))
    const onNext = vi.fn()
    render(
      <UploadFlow
        state={{
          type: StepType.selectSheet,
          workbook: {
            SheetNames: ["Sheet1", "Sheet2"],
            Sheets: { Sheet1: { "!ref": "A1:B2" }, Sheet2: { "!ref": "A1:B2" } },
          },
        }}
        onNext={onNext}
      />,
    )

    fireEvent.click(screen.getByText("select-sheet-continue"))

    await waitFor(() => {
      expect(mockToastCreate).toHaveBeenCalledWith(
        expect.objectContaining({ description: "selected sheet failed" }),
      )
      expect(onNext).not.toHaveBeenCalled()
    })
  })

  it("toasts match columns errors without calling onAsyncError", async () => {
    const onAsyncError = vi.fn()
    mockUseRsi.mockReturnValue({
      ...baseRsiValue,
      onAsyncError,
    })
    mockMatchColumnsStepHook.mockRejectedValue(new Error("match failed"))
    const onNext = vi.fn()
    render(
      <UploadFlow
        state={{
          type: StepType.matchColumns,
          data: [["A"]],
          headerValues: ["name"],
        }}
        onNext={onNext}
      />,
    )

    fireEvent.click(screen.getByText("match-columns-continue"))

    await waitFor(() => {
      expect(mockToastCreate).toHaveBeenCalledWith(
        expect.objectContaining({ description: "match failed" }),
      )
      expect(onNext).not.toHaveBeenCalled()
      expect(onAsyncError).not.toHaveBeenCalled()
    })
  })

  it("renders nothing for validateData when file has not been uploaded", () => {
    const onNext = vi.fn()
    const { queryByTestId } = render(
      <UploadFlow state={{ type: StepType.validateData, data: [] }} onNext={onNext} />,
    )

    expect(queryByTestId("validation-step")).not.toBeInTheDocument()
  })
})
