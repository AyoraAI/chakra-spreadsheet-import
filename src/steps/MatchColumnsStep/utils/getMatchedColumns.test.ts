import { describe, expect, it } from "vitest"
import { getMatchedColumns } from "./getMatchedColumns"
import { ColumnType, type Columns } from "../types"
import type { Fields, RawData } from "../../../types"

type Keys = "email"

const fields: Fields<Keys> = [
  {
    key: "email",
    label: "Email",
    fieldType: { type: "input" },
  },
]

const emptyColumn = (index: number, header: string) =>
  ({
    index,
    header,
    type: ColumnType.empty,
  }) as const

describe("getMatchedColumns", () => {
  it("matches a single column when header is close enough", () => {
    const columns: Columns<Keys> = [emptyColumn(0, "email")]

    const result = getMatchedColumns(columns, fields, [] as RawData[], 0)

    expect(result).toEqual([
      { index: 0, header: "email", type: ColumnType.matched, value: "email" },
    ])
  })

  it("keeps the better duplicate match and clears the worse one", () => {
    const columns: Columns<Keys> = [
      emptyColumn(0, "email"),
      emptyColumn(1, "e-mail"),
    ]

    const result = getMatchedColumns(columns, fields, [] as RawData[], 2)

    expect(result).toEqual([
      { index: 0, header: "email", type: ColumnType.matched, value: "email" },
      { index: 1, header: "e-mail", type: ColumnType.empty },
    ])
  })

  it("replaces an earlier duplicate when a later header is a better match", () => {
    const columns: Columns<Keys> = [
      emptyColumn(0, "e-mail"),
      emptyColumn(1, "email"),
    ]

    const result = getMatchedColumns(columns, fields, [] as RawData[], 2)

    expect(result).toEqual([
      { index: 0, header: "e-mail", type: ColumnType.empty },
      { index: 1, header: "email", type: ColumnType.matched, value: "email" },
    ])
  })
})
