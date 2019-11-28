
const unicodeEmojis = [
  "1F436", "1F98A", "1F431", "1F638", "1F42F", "1F435", "1F43C",
  "1F428", "1F43B", "1F430", "1F439", "1F42D", "1F419"
]
const hashIntStart = 0
const hashIntEnd = 4294967295 // inclusive
const rangeStep = Math.floor(
  (hashIntEnd - hashIntStart + 1) / unicodeEmojis.length
)
const ranges = getRanges(hashIntStart, hashIntEnd, rangeStep)

export default function stringToEmoji (input: string) {
  const intHash = hashStrToInt(input)
  const emojiIndex = ranges.findIndex(
    (v, index, arr) =>
      intHash >= v && (arr.length - 2 <= index || intHash < arr[index+1])
  )

  return String.fromCodePoint(Number('0x' + unicodeEmojis[emojiIndex]))
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 */
function getRanges (start: number, stop: number, step: number) {
  return Array.from(
    { length: (stop - start) / step + 1},
    (_, i) => start + (i * step)
  )
}

/**
 * @see https://github.com/darkskyapp/string-hash
 */
function hashStrToInt (str: string) {
  let hash = 5381
  let i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0
}