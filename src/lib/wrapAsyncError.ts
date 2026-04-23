export function wrapAsyncError<T extends unknown[]>(
  fn: (...args: T) => void | Promise<void>,
  onAsyncError?: (err: unknown) => void,
): (...args: T) => void {
  return (...args: T) => {
    void Promise.resolve(fn(...args)).catch((err: unknown) => {
      onAsyncError?.(err)
    })
  }
}
