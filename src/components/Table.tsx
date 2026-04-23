import { DataGrid, type DataGridProps } from "react-data-grid"
import { useRsi } from "../hooks/useRsi"
import { useDocumentColorMode } from "../lib/useDocumentColorMode"

interface Props<Data> extends DataGridProps<Data> {
  rowHeight?: number
  hiddenHeader?: boolean
}

export const Table = <Data,>({ className, ...props }: Props<Data>) => {
  const { rtl } = useRsi()

  const colorMode = useDocumentColorMode()

  return (
    <DataGrid
      className={`rdg-${colorMode} ${className ?? ""}`}
      direction={rtl ? "rtl" : "ltr"}
      {...props}
    />
  )
}
