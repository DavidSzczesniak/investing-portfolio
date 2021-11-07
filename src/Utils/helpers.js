export function isPositive(num) {
    return num >= 0;
}

export function normalizeNumber(number, decimalPoints = 2) {
    return Number(number.toFixed(decimalPoints)).toLocaleString();
}

export function compactNumber(number) {
    return new Intl.NumberFormat('en-GB', {
        notation: 'compact',
        minimumSignificantDigits: 4,
        maximumSignificantDigits: 6,
    }).format(number);
}
