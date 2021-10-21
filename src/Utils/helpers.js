export function isPositive(num) {
    return num >= 0;
}

export function normalizeNumber(number, decimalPoints = 2) {
    return Number(number.toFixed(decimalPoints)).toLocaleString();
}

export function getCSSVar(variableName) {
    return getComputedStyle(document.body).getPropertyValue(`--${variableName}`).trim();
}
