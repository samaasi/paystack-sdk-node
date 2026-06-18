export function stringifyQuery(
  obj: object,
  prefix?: string,
): string {
  const pairs: string[] = []
  const record = obj as Record<string, unknown>

  for (const key in record) {
    if (!Object.prototype.hasOwnProperty.call(record, key)) continue

    const value = record[key]
    const encodedKey = prefix
      ? `${prefix}[${encodeURIComponent(key)}]`
      : encodeURIComponent(key)

    if (value === null || value === undefined) {
      continue
    }

    if (typeof value === 'object') {
      if (value instanceof Date) {
        pairs.push(`${encodedKey}=${encodeURIComponent(value.toISOString())}`)
      } else if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const arrValue = value[i]
          if (arrValue === null || arrValue === undefined) continue

          if (typeof arrValue === 'object') {
            if (arrValue instanceof Date) {
              pairs.push(
                `${encodedKey}[${i}]=${encodeURIComponent(arrValue.toISOString())}`,
              )
            } else {
              pairs.push(
                stringifyQuery(
                  arrValue as object,
                  `${encodedKey}[${i}]`,
                ),
              )
            }
          } else {
            pairs.push(
              `${encodedKey}[${i}]=${encodeURIComponent(String(arrValue))}`,
            )
          }
        }
      } else {
        pairs.push(stringifyQuery(value as object, encodedKey))
      }
    } else {
      pairs.push(`${encodedKey}=${encodeURIComponent(String(value))}`)
    }
  }

  return pairs.filter(Boolean).join('&')
}
