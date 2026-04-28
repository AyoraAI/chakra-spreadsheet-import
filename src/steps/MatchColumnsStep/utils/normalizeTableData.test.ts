import { describe, expect, it } from "vitest"
import { normalizeTableData } from "./normalizeTableData"
import { ColumnType, type Columns } from "../types"
import type { Fields, RawData } from "../../../types"

type Keys = "name" | "active" | "role"

const fields: Fields<Keys> = [
  { key: "name", label: "Name", fieldType: { type: "input" } },
  {
    key: "active",
    label: "Active",
    fieldType: { type: "checkbox", booleanMatches: { y: true, n: false } },
  },
  {
    key: "role",
    label: "Role",
    fieldType: {
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
  },
]

describe("normalizeTableData", () => {
  it("normalizes matched, checkbox, and select columns", () => {
    const columns: Columns<Keys> = [
      { index: 0, header: "Name", type: ColumnType.matched, value: "name" },
      {
        index: 1,
        header: "Active",
        type: ColumnType.matchedCheckbox,
        value: "active",
      },
      {
        index: 2,
        header: "Role",
        type: ColumnType.matchedSelectOptions,
        value: "role",
        matchedOptions: [
          { entry: "Admin", value: "admin" },
        ] as unknown as Columns<Keys>[number] extends { matchedOptions: infer M }
          ? M
          : never,
      },
    ]
    const data: RawData[] = [["Alice", "Y", "Admin"], ["", "no", "Unknown"]]

    expect(normalizeTableData(columns, data, fields)).toEqual([
      { name: "Alice", active: true, role: "admin" },
      { name: undefined, active: false, role: undefined },
    ])
  })

  it("falls back to boolean whitelist when checkbox booleanMatches do not match", () => {
    const columns: Columns<Keys> = [
      {
        index: 0,
        header: "Active",
        type: ColumnType.matchedCheckbox,
        value: "active",
      },
    ]

    expect(normalizeTableData(columns, [["true"]], fields)).toEqual([
      { active: true },
    ])
  })

  it("ignores empty and ignored columns", () => {
    const columns: Columns<Keys> = [
      { index: 0, header: "Unused", type: ColumnType.empty },
      { index: 1, header: "Ignored", type: ColumnType.ignored },
    ]

    expect(normalizeTableData(columns, [["x", "y"]], fields)).toEqual([{}])
  })
})
