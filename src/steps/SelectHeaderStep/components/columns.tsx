import { Column, type RenderCellProps, useRowSelection } from "react-data-grid"
import type { RawData } from "../../../types"
import { RadioGroup } from "@chakra-ui/react"

const SELECT_COLUMN_KEY = "select-row"

function SelectFormatter(props: RenderCellProps<unknown>) {
  const { isRowSelected, onRowSelectionChange } = useRowSelection()

  return (
    <RadioGroup.Root
      bg="inherit"
      aria-label="Select"
      value={isRowSelected ? "1" : "0"}
      size="md"
      colorPalette="primary"
      onValueChange={(event) => {
        onRowSelectionChange({
          row: props.row,
          checked: Boolean(event.value),
          isShiftClick: false,
        })
      }}
    >
      <RadioGroup.Item value="1">
        <RadioGroup.ItemHiddenInput />
        <RadioGroup.ItemIndicator />
      </RadioGroup.Item>
    </RadioGroup.Root>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SelectColumn: Column<any, any> = {
  key: SELECT_COLUMN_KEY,
  name: "",
  width: 35,
  minWidth: 35,
  maxWidth: 35,
  resizable: false,
  sortable: false,
  frozen: true,
  cellClass: "rdg-radio",
  renderCell: SelectFormatter,
}

export const generateSelectionColumns = (data: RawData[]) => {
  const longestRowLength = data.reduce(
    (acc, curr) => (acc > curr.length ? acc : curr.length),
    0,
  )
  return [
    SelectColumn,
    ...Array.from(Array(longestRowLength), (_, index) => ({
      key: index.toString(),
      name: "",
    })),
  ]
}
