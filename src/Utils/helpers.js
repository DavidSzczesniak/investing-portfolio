export function isPositive(num) {
    return num >= 0;
}

export function normalizeNumber(number, decimalPoints = 2) {
    return Number(number.toFixed(decimalPoints)).toLocaleString();
}
