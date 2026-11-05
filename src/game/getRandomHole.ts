type RandomFn = () => number

/**
 * Returns a random hole index between 0 and total - 1, never equal to `exclude`,
 * so the mole never stays in the same hole twice in a row.
 *
 * Draws among the `total - 1` valid holes and shifts by one those at or after
 * the excluded index: a single draw, no retry loop.
 *
 * `random` is injected (Math.random by default) so tests can pass fixed values
 * without patching globals.
 */
export function getRandomHole(
    total: number,
    exclude: number | null,
    random: RandomFn = Math.random,
): number {
    const randomInt = (max: number) => Math.floor(random() * max)

    if (exclude === null || total <= 1) {
        return randomInt(total)
    }

    const next = randomInt(total - 1)
    return next >= exclude ? next + 1 : next
}
