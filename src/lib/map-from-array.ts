export function mapFromArray<K, V>(
  array: V[],
  mapFn: (item: V) => K
): Map<K, V> {
  return array.reduce(
    (map, item) => map.set(mapFn(item), item),
    new Map<K, V>()
  )
}
