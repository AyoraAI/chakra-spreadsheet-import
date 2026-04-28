import { fireEvent, render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Steps } from "./Steps"

const mockUseRsi = vi.fn()

vi.mock("../hooks/useRsi", () => ({
  useRsi: () => mockUseRsi(),
}))

vi.mock("./UploadFlow", () => ({
  StepType: {
    upload: "upload",
    selectSheet: "selectSheet",
    selectHeader: "selectHeader",
    matchColumns: "matchColumns",
    validateData: "validateData",
  },
  UploadFlow: ({
    onNext,
    onBack,
  }: {
    onNext: (next: { type: string }) => void
    onBack?: () => void
  }) => (
    <div>
      <div data-testid="has-back">{onBack ? "yes" : "no"}</div>
      <button onClick={() => onNext({ type: "selectSheet" })}>next-select-sheet</button>
      <button onClick={() => onNext({ type: "selectHeader" })}>next-select-header</button>
    </div>
  ),
}))

vi.mock("@chakra-ui/react", () => ({
  Dialog: {
    Header: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Body: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
  Steps: {
    Root: ({
      step,
      children,
      onStepChange,
    }: {
      step: number
      children: ReactNode
      onStepChange?: (event: { step: number }) => void
    }) => (
      <div data-testid="step-root" data-step={step}>
        <button onClick={() => onStepChange?.({ step: 0 })}>goto-step-0</button>
        <button onClick={() => onStepChange?.({ step: 3 })}>goto-step-3</button>
        {children}
      </div>
    ),
    List: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Item: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Indicator: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Status: () => <span>status</span>,
    Title: ({ children }: { children: ReactNode }) => <span>{children}</span>,
    Separator: () => <span>|</span>,
  },
}))

describe("Steps", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseRsi.mockReturnValue({
      initialStepState: undefined,
      isNavigationEnabled: false,
      translations: {
        uploadStep: { title: "Upload" },
        selectHeaderStep: { title: "Header" },
        matchColumnsStep: { title: "Match" },
        validationStep: { title: "Validate" },
      },
    })
  })

  it("does not provide back navigation when disabled", () => {
    render(<Steps />)
    expect(screen.getByTestId("has-back")).toHaveTextContent("no")
  })

  it("provides back navigation when enabled", () => {
    mockUseRsi.mockReturnValue({
      initialStepState: undefined,
      isNavigationEnabled: true,
      translations: {
        uploadStep: { title: "Upload" },
        selectHeaderStep: { title: "Header" },
        matchColumnsStep: { title: "Match" },
        validationStep: { title: "Validate" },
      },
    })
    render(<Steps />)
    expect(screen.getByTestId("has-back")).toHaveTextContent("yes")
  })

  it("does not increment step for selectSheet transitions but increments others", () => {
    render(<Steps />)
    const stepRoot = screen.getByTestId("step-root")
    expect(stepRoot).toHaveAttribute("data-step", "0")

    fireEvent.click(screen.getByText("next-select-sheet"))
    expect(stepRoot).toHaveAttribute("data-step", "0")

    fireEvent.click(screen.getByText("next-select-header"))
    expect(stepRoot).toHaveAttribute("data-step", "1")
  })

  it("allows backtracking to a step in history when navigation is enabled", () => {
    mockUseRsi.mockReturnValue({
      initialStepState: undefined,
      isNavigationEnabled: true,
      translations: {
        uploadStep: { title: "Upload" },
        selectHeaderStep: { title: "Header" },
        matchColumnsStep: { title: "Match" },
        validationStep: { title: "Validate" },
      },
    })

    render(<Steps />)
    const stepRoot = screen.getByTestId("step-root")

    fireEvent.click(screen.getByText("next-select-header"))
    expect(stepRoot).toHaveAttribute("data-step", "1")

    fireEvent.click(screen.getByText("goto-step-0"))
    expect(stepRoot).toHaveAttribute("data-step", "0")
  })

  it("ignores navigation to steps not present in history", () => {
    mockUseRsi.mockReturnValue({
      initialStepState: undefined,
      isNavigationEnabled: true,
      translations: {
        uploadStep: { title: "Upload" },
        selectHeaderStep: { title: "Header" },
        matchColumnsStep: { title: "Match" },
        validationStep: { title: "Validate" },
      },
    })

    render(<Steps />)
    const stepRoot = screen.getByTestId("step-root")
    expect(stepRoot).toHaveAttribute("data-step", "0")

    fireEvent.click(screen.getByText("goto-step-3"))
    expect(stepRoot).toHaveAttribute("data-step", "0")
  })
})
