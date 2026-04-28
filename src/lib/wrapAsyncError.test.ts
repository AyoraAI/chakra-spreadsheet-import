import { describe, expect, it, vi } from "vitest"
import { wrapAsyncError } from "./wrapAsyncError"

describe("wrapAsyncError", () => {
  it("forwards arguments to wrapped function", () => {
    const fn = vi.fn()
    const wrapped = wrapAsyncError(fn)

    wrapped("one", 2)

    expect(fn).toHaveBeenCalledWith("one", 2)
  })

  it("calls onAsyncError when wrapped function rejects", async () => {
    const error = new Error("boom")
    const onAsyncError = vi.fn()
    const wrapped = wrapAsyncError(async () => {
      throw error
    }, onAsyncError)

    wrapped()
    await Promise.resolve()

    expect(onAsyncError).toHaveBeenCalledWith(error)
  })

  it("rethrows synchronous errors from wrapped function", () => {
    const error = new Error("sync-fail")
    const onAsyncError = vi.fn()
    const wrapped = wrapAsyncError(() => {
      throw error
    }, onAsyncError)

    expect(() => wrapped()).toThrow(error)
    expect(onAsyncError).not.toHaveBeenCalled()
  })
})
