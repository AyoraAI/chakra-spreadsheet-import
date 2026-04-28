import { describe, expect, it, vi } from "vitest"
import { addErrorsAndRunHooks } from "./dataMutations"
import { ErrorSources, type Data, type Fields } from "../../../types"

type Keys = "name" | "email"

describe("addErrorsAndRunHooks", () => {
  it("runs tableHook before rowHook and applies built-in validations", async () => {
    const callOrder: string[] = []
    const fields: Fields<Keys> = [
      {
        key: "name",
        label: "Name",
        fieldType: { type: "input" },
        validations: [{ rule: "required" }],
      },
      {
        key: "email",
        label: "Email",
        fieldType: { type: "input" },
        validations: [{ rule: "regex", value: "^[^@]+@[^@]+\\.[^@]+$", errorMessage: "Invalid email" }],
      },
    ]
    const tableHook = vi.fn(async (table: Data<Keys>[]) => {
      callOrder.push("tableHook")
      return table
    })
    const rowHook = vi.fn(async (row: Data<Keys>) => {
      callOrder.push("rowHook")
      return row
    })

    const result = await addErrorsAndRunHooks(
      [{ name: "", email: "not-an-email" }],
      fields,
      rowHook,
      tableHook,
    )

    expect(callOrder).toEqual(["tableHook", "rowHook"])
    expect(result[0].__errors).toMatchObject({
      name: { source: ErrorSources.Row, message: "Field is required" },
      email: {
        source: ErrorSources.Row,
        message: "Field did not match the regex /^[^@]+@[^@]+\\.[^@]+$/ ",
      },
    })
    expect(result[0].__index).toBeTypeOf("string")
  })

  it("validates unique fields and respects allowEmpty", async () => {
    const fields: Fields<Keys> = [
      {
        key: "email",
        label: "Email",
        fieldType: { type: "input" },
        validations: [{ rule: "unique", allowEmpty: true }],
      },
      {
        key: "name",
        label: "Name",
        fieldType: { type: "input" },
      },
    ]

    const result = await addErrorsAndRunHooks(
      [
        { name: "A", email: "a@example.com" },
        { name: "B", email: "a@example.com" },
        { name: "C", email: undefined },
        { name: "D", email: undefined },
      ],
      fields,
    )

    expect(result[0].__errors?.email.source).toBe(ErrorSources.Table)
    expect(result[1].__errors?.email.source).toBe(ErrorSources.Table)
    expect(result[2].__errors).toBeUndefined()
    expect(result[3].__errors).toBeUndefined()
  })

  it("runs rowHook only for changed rows on partial revalidation", async () => {
    const fields: Fields<Keys> = [
      {
        key: "name",
        label: "Name",
        fieldType: { type: "input" },
        validations: [{ rule: "required" }],
      },
      {
        key: "email",
        label: "Email",
        fieldType: { type: "input" },
      },
    ]
    const rowHook = vi.fn(async (row: Data<Keys>) => row)

    await addErrorsAndRunHooks(
      [{ name: "A", email: "" }, { name: "", email: "" }],
      fields,
      rowHook,
      undefined,
      [1],
    )

    expect(rowHook).toHaveBeenCalledTimes(1)
    expect(rowHook.mock.calls[0][0]).toMatchObject({ name: "", email: "" })
  })

  it("preserves row errors for untouched rows while applying new table errors", async () => {
    const fields: Fields<Keys> = [
      {
        key: "name",
        label: "Name",
        fieldType: { type: "input" },
        validations: [{ rule: "unique" }],
      },
      {
        key: "email",
        label: "Email",
        fieldType: { type: "input" },
      },
    ]

    const existingRowError = {
      email: {
        source: ErrorSources.Row,
        level: "error" as const,
        message: "Existing row error",
      },
    }

    const result = await addErrorsAndRunHooks(
      [
        { __index: "row-0", name: "dup", email: "a", __errors: existingRowError },
        { __index: "row-1", name: "dup", email: "b" },
      ],
      fields,
      undefined,
      undefined,
      [1],
    )

    expect(result[0].__errors).toMatchObject({
      email: existingRowError.email,
      name: { source: ErrorSources.Table, message: "Field must be unique" },
    })
    expect(result[1].__errors).toMatchObject({
      name: { source: ErrorSources.Table, message: "Field must be unique" },
    })
  })
})
