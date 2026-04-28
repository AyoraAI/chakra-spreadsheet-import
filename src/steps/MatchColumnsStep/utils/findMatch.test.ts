import { describe, expect, it } from "vitest"
import { findMatch } from "./findMatch"
import type { Fields } from "../../../types"

type Keys = "firstName" | "email"

const fields: Fields<Keys> = [
  {
    key: "firstName",
    label: "First name",
    alternateMatches: ["fname"],
    fieldType: { type: "input" },
  },
  {
    key: "email",
    label: "Email",
    fieldType: { type: "input" },
  },
]

describe("findMatch", () => {
  it("returns undefined when no fields are available", () => {
    expect(findMatch("email", [], 2)).toBeUndefined()
  })

  it("matches by key when distance is within threshold", () => {
    expect(findMatch("email", fields, 0)).toBe("email")
  })

  it("matches against alternate field names", () => {
    expect(findMatch("fname", fields, 0)).toBe("firstName")
  })

  it("returns undefined when best match exceeds threshold", () => {
    expect(findMatch("phone", fields, 1)).toBeUndefined()
  })
})
