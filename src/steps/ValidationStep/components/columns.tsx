import { Column, useRowSelection } from "react-data-grid"
import { Box, Checkbox, Input, Switch } from "@chakra-ui/react"
import type { Data, Fields } from "../../../types"
import type { ChangeEvent } from "react"
import type { Meta } from "../types"
import { CgInfo } from "react-icons/cg"
import { TableSelect } from "../../../components/Selects/TableSelect"
import { RsiTooltip } from "../../../lib/Tooltip"

const SELECT_COLUMN_KEY = "select-row"

function autoFocusAndSelect(input: HTMLInputElement | null) {
  input?.focus()
  input?.select()
}

export const generateColumns = <T extends string>(
  fields: Fields<T>,
): Column<Data<T> & Meta>[] => [
  {
    key: SELECT_COLUMN_KEY,
    name: "",
    width: 35,
    minWidth: 35,
    maxWidth: 35,
    resizable: false,
    sortable: false,
    frozen: true,
    cellClass: "rdg-checkbox",
    renderCell: (props) => {
      // eslint-disable-next-line  react-hooks/rules-of-hooks
      const { isRowSelected, onRowSelectionChange } = useRowSelection()

      return (
        <Checkbox.Root
          bg="white"
          aria-label="Select"
          size="sm"
          colorPalette="primary"
          checked={isRowSelected}
          onCheckedChange={(event) => {
            onRowSelectionChange({
              row: props.row,
              checked: Boolean(event.checked),
              isShiftClick: false,
            })
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      )
    },
  },
  ...fields.map(
    (column): Column<Data<T> & Meta> => ({
      key: column.key,
      name: column.label,
      minWidth: 150,
      resizable: true,
      renderHeaderCell: () => (
        <Box display="flex" gap={1} alignItems="center" position="relative">
          <Box flex={1} overflow="hidden" textOverflow="ellipsis">
            {column.label}
          </Box>
          {column.description && (
            <RsiTooltip
              positioning={{ placement: "top" }}
              content={column.description}
            >
              <Box flex={"0 0 auto"}>
                <CgInfo size="16px" />
              </Box>
            </RsiTooltip>
          )}
        </Box>
      ),
      editable: column.fieldType.type !== "checkbox",
      renderEditCell: ({ row, onRowChange, onClose }) => {
        let component

        switch (column.fieldType.type) {
          case "select":
            component = (
              <TableSelect
                value={column.fieldType.options.find(
                  (option) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                    option.value === ((row as any)[column.key] as string),
                )}
                onChange={(value) => {
                  onRowChange({ ...row, [column.key]: value?.value }, true)
                }}
                options={column.fieldType.options}
              />
            )
            break
          default:
            component = (
              <Box>
                <Input
                  ref={autoFocusAndSelect}
                  variant="flushed"
                  autoFocus
                  size="sm"
                  value={row[column.key] as string}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    onRowChange({ ...row, [column.key]: event.target.value })
                  }}
                  onBlur={() => {
                    onClose(true)
                  }}
                />
              </Box>
            )
        }

        return component
      },

      renderCell: ({ row, onRowChange }) => {
        let component

        switch (column.fieldType.type) {
          case "checkbox":
            component = (
              <Box
                display="flex"
                alignItems="center"
                height="100%"
                onClick={(event) => {
                  event.stopPropagation()
                }}
              >
                <Switch.Root
                  checked={row[column.key] as boolean}
                  onCheckedChange={(event) => {
                    onRowChange({
                      ...row,
                      [column.key]: event.checked ? row[column.key as T] : null,
                    })
                  }}
                >
                  <Switch.HiddenInput />
                  <Switch.Control />
                </Switch.Root>
              </Box>
            )
            break
          case "select":
            component = (
              <Box
                minWidth="100%"
                minHeight="100%"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {column.fieldType.options.find(
                  (option) => option.value === row[column.key as T],
                )?.label ?? null}
              </Box>
            )
            break
          default:
            component = (
              <Box
                minWidth="100%"
                minHeight="100%"
                overflow="hidden"
                textOverflow="ellipsis"
                fontSize="sm"
                display="flex"
                alignItems="center"
              >
                {row[column.key as T]}
              </Box>
            )
        }

        if (row.__errors?.[column.key]) {
          return (
            <RsiTooltip
              positioning={{ placement: "top" }}
              content={row.__errors[column.key].message}
            >
              {component}
            </RsiTooltip>
          )
        }

        return component
      },
      cellClass: (row: Meta) => {
        switch (row.__errors?.[column.key]?.level) {
          case "error":
            return "rdg-cell-error"
          case "warning":
            return "rdg-cell-warning"
          case "info":
            return "rdg-cell-info"
          default:
            return ""
        }
      },
    }),
  ),
]
