/**
 * sum
 * @param {number} m base
 * @param {number} n index
 * @returns {number}
 */
export default function sum(m, n) {
  if (isNaN(m) || isNaN(n)) {
    alert("not a number");
    return;
  }
  return +m + +n;
}
