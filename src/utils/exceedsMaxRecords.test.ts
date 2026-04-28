import { describe, expect, it } from "vitest"
import { exceedsMaxRecords } from "./exceedsMaxRecords"

describe("exceedsMaxRecords", () => {
  it("returns true when worksheet range exceeds max records", () => {
    const worksheet = { "!ref": "A1:C10" }
    expect(exceedsMaxRecords(worksheet as never, 5)).toBe(true)
  })

  it("returns false when worksheet range is within max records", () => {
    const worksheet = { "!ref": "A1:C5" }
    expect(exceedsMaxRecords(worksheet as never, 10)).toBe(false)
  })

  it("returns false when worksheet has no range ref", () => {
    expect(exceedsMaxRecords({} as never, 1)).toBe(false)
  })
})
