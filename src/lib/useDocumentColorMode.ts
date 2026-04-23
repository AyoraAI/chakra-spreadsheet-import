import { useSyncExternalStore } from "react"

function subscribe(callback: () => void) {
  const el = document.documentElement
  const obs = new MutationObserver(callback)
  obs.observe(el, { attributes: true, attributeFilter: ["class"] })
  return () => {
    obs.disconnect()
  }
}

function getSnapshot(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function getServerSnapshot(): "light" {
  return "light"
}

/** Resolves light/dark from `document.documentElement` class (e.g. next-themes, Chakra). */
export function useDocumentColorMode() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
