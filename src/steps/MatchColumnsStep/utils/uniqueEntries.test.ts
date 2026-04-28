import { describe, expect, it } from "vitest"
import { uniqueEntries } from "./uniqueEntries"

describe("uniqueEntries", () => {
  it("returns unique non-empty values for a column index", () => {
    const data = [
      ["Admin", "x"],
      ["Admin", "y"],
      ["User", "z"],
    ]

    expect(uniqueEntries(data, 0)).toEqual([{ entry: "Admin" }, { entry: "User" }])
  })

  it("filters out undefined and empty-string entries", () => {
    const data = [
      [undefined],
      [""],
      ["Team Lead"],
    ]

    expect(uniqueEntries(data, 0)).toEqual([{ entry: "Team Lead" }])
  })
})
