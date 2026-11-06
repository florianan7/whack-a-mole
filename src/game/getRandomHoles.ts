/** Elige `count` casillas distintas al azar, evitando las de `exclude`. */
export function getRandomHoles(
    total: number,
    count: number,
    exclude: ReadonlySet<number>,
    random: () => number = Math.random,
): Set<number> {
    const free = Array.from({length: total}, (_, hole) => hole).filter((hole) => !exclude.has(hole))
    const picked = new Set<number>()
    while (picked.size < count && free.length) {
        const [hole] = free.splice(Math.floor(random() * free.length), 1)
        picked.add(hole)
    }
    return picked
}
