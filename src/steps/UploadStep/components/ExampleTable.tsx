import type { Fields } from "../../../types"
import { useMemo, useEffect, useRef, useState } from "react"
import { Table } from "../../../components/Table"
import { generateColumns } from "./columns"
import { generateExampleRow } from "../utils/generateExampleRow"

interface Props<T extends string> {
  fields: Fields<T>
}

export const ExampleTable = <T extends string = string>({
  fields,
}: Props<T>) => {
  const [renderKey, setRenderKey] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const data = useMemo(() => generateExampleRow(fields), [fields])
  const columns = useMemo(() => generateColumns(fields), [fields])

  useEffect(() => {
    // Wait for the container to be properly sized, then force a re-render
    const checkSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        if (rect.width > 0) {
          // Container has width, force re-render
          setRenderKey((prev) => {
            return prev + 1
          })
        } else {
          // Try again in a bit
          setTimeout(checkSize, 100)
        }
      }
    }

    // Start checking after a short delay
    const timer = setTimeout(checkSize, 200)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <Table
        key={renderKey}
        rows={data}
        columns={columns}
        className={"rdg-example"}
        rowHeight={35}
        style={{ width: "100%" }}
      />
    </div>
  )
}
