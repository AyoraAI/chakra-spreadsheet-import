import { Select } from "chakra-react-select"
import type { SelectOption } from "../../types"

interface Props {
  onChange: (value: SelectOption | null) => void
  value?: SelectOption
  options: readonly SelectOption[]
  placeholder?: string
  name?: string
}

export const MatchColumnSelect = ({
  onChange,
  value,
  options,
  placeholder,
  name,
}: Props) => {
  return (
    <Select<SelectOption>
      value={value ?? null}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      menuPosition="fixed"
      aria-label={name}
    />
  )
}
