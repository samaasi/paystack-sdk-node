export function stringifyQuery(
  obj: Record<string, unknown>,
  prefix?: string,
): string {
  const pairs: string[] = []

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue

    const value = obj[key]
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
              pairs.push(`${encodedKey}[${i}]=${encodeURIComponent(arrValue.toISOString())}`)
            } else {
              pairs.push(stringifyQuery(arrValue as Record<string, unknown>, `${encodedKey}[${i}]`))
            }
          } else {
            pairs.push(`${encodedKey}[${i}]=${encodeURIComponent(String(arrValue))}`)
          }
        }
      } else {
        pairs.push(stringifyQuery(value as Record<string, unknown>, encodedKey))
      }
    } else {
      pairs.push(`${encodedKey}=${encodeURIComponent(String(value))}`)
    }
  }

  return pairs.filter(Boolean).join('&')
}
