import { rootId } from "../Providers"
import { Select } from "chakra-react-select"
import type { SelectOption } from "../../types"

interface Props {
  onChange: (value: SelectOption | null) => void
  value?: SelectOption
  options: readonly SelectOption[]
}

export const TableSelect = ({ onChange, value, options }: Props) => {
  return (
    <Select<SelectOption>
      autoFocus
      size="sm"
      value={value}
      onChange={onChange}
      placeholder=" "
      closeMenuOnScroll
      menuPosition="fixed"
      menuIsOpen
      menuPortalTarget={document.getElementById(rootId)}
      options={options}
    />
  )
}
