import { useMemo } from "react"
import { Table } from "../../../components/Table"
import { generateSelectionColumns } from "./columns"
import type { RawData } from "../../../types"

interface Props {
  data: RawData[]
  selectedRows: ReadonlySet<number>
  setSelectedRows: (rows: ReadonlySet<number>) => void
}

export const SelectHeaderTable = ({
  data,
  selectedRows,
  setSelectedRows,
}: Props) => {
  const columns = useMemo(() => generateSelectionColumns(data), [data])

  return (
    <Table
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      rowKeyGetter={(row) => data.indexOf(row)}
      rows={data}
      columns={columns}
      selectedRows={selectedRows}
      onSelectedRowsChange={(newRows) => {
        // allow selecting only one row
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        newRows.forEach((value) => {
          if (!selectedRows.has(value as number)) {
            setSelectedRows(new Set([value as number]))
            return
          }
        })
      }}
      onCellClick={(row) => {
        setSelectedRows(new Set([data.indexOf(row as unknown as RawData)]))
      }}
      headerRowHeight={0}
      className="rdg-static"
    />
  )
}
