import { describe, expect, it } from "vitest"
import { setColumn } from "./setColumn"
import { ColumnType, type Column } from "../types"
import type { Field } from "../../../types"

type Keys = "role" | "Admin" | "User" | "status" | "name"

const baseColumn: Column<Keys> = {
  index: 0,
  header: "Role",
  type: ColumnType.empty,
}

describe("setColumn", () => {
  it("returns empty when field is not provided", () => {
    expect(setColumn(baseColumn)).toEqual({
      index: 0,
      header: "Role",
      type: ColumnType.empty,
    })
  })

  it("maps input fields to matched columns", () => {
    const field: Field<Keys> = {
      key: "name",
      label: "Name",
      fieldType: { type: "input" },
    }

    expect(setColumn(baseColumn, field)).toEqual({
      index: 0,
      header: "Role",
      type: ColumnType.matched,
      value: "name",
    })
  })

  it("maps checkbox fields to matchedCheckbox columns", () => {
    const field: Field<Keys> = {
      key: "status",
      label: "Status",
      fieldType: { type: "checkbox" },
    }

    expect(setColumn(baseColumn, field)).toEqual({
      index: 0,
      header: "Role",
      type: ColumnType.matchedCheckbox,
      value: "status",
    })
  })

  it("maps select fields without auto-mapping as matchedSelect", () => {
    const field: Field<Keys> = {
      key: "role",
      label: "Role",
      fieldType: {
        type: "select",
        options: [
          { label: "Admin", value: "Admin" },
          { label: "User", value: "User" },
        ],
      },
    }
    const data = [["Admin"], ["User"], ["Admin"]]

    const result = setColumn(baseColumn, field, data, false)

    expect(result.type).toBe(ColumnType.matchedSelect)
    if (result.type === ColumnType.matchedSelect) {
      expect(result.value).toBe("role")
      expect(result.matchedOptions).toEqual([{ entry: "Admin" }, { entry: "User" }])
    }
  })

  it("maps all select options when auto-mapping is enabled", () => {
    const field: Field<Keys> = {
      key: "role",
      label: "Role",
      fieldType: {
        type: "select",
        options: [
          { label: "Administrator", value: "Admin" },
          { label: "User", value: "User" },
        ],
      },
    }
    const data = [["Administrator"], ["User"]]

    const result = setColumn(baseColumn, field, data, true)

    expect(result.type).toBe(ColumnType.matchedSelectOptions)
    if (result.type === ColumnType.matchedSelectOptions) {
      expect(result.value).toBe("role")
      expect(result.matchedOptions).toEqual([
        { entry: "Administrator", value: "Admin" },
        { entry: "User", value: "User" },
      ])
    }
  })

  it("keeps partially matched select options in matchedSelect mode", () => {
    const field: Field<Keys> = {
      key: "role",
      label: "Role",
      fieldType: {
        type: "select",
        options: [{ label: "User", value: "User" }],
      },
    }
    const data = [["User"], ["Unknown"]]

    const result = setColumn(baseColumn, field, data, true)

    expect(result.type).toBe(ColumnType.matchedSelect)
  })
})
