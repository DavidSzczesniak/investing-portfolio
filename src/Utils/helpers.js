export function isPositive(num) {
    return num >= 0;
}

export function normalizeNumber(number, decimalPoints = 2) {
    return Number(number.toFixed(decimalPoints)).toLocaleString();
}

export function compactNumber(number, digits = 4) {
    return new Intl.NumberFormat('en-GB', {
        notation: 'compact',
        minimumSignificantDigits: digits,
    }).format(number);
}
