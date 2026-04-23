import lavenstein from "js-levenshtein"
import type { Fields } from "../../../types"

interface AutoMatchAccumulator<T> {
  distance: number
  value: T
}

export const findMatch = <T extends string>(
  header: string,
  fields: Fields<T>,
  autoMapDistance: number,
): T | undefined => {
  if (fields.length === 0) return undefined

  const smallestValue = fields.reduce<AutoMatchAccumulator<T>>(
    (acc, field) => {
      const keyDistance = lavenstein(field.key, header)
      const alternateMatches =
        field.alternateMatches?.map((alternate) =>
          lavenstein(alternate, header),
        ) ?? []

      const distance = Math.min(...[keyDistance, ...alternateMatches])

      return distance < acc.distance
        ? ({ value: field.key, distance } as AutoMatchAccumulator<T>)
        : acc
    },
    { distance: Infinity, value: fields[0].key } as AutoMatchAccumulator<T>,
  )

  return smallestValue.distance <= autoMapDistance
    ? smallestValue.value
    : undefined
}
