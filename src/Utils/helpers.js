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

export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function getCSSVar(variableName) {
    return getComputedStyle(document.body).getPropertyValue(`--${variableName}`).trim();
}

export function disableScrolling() {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
}

export function enableScrolling() {
    document.getElementsByTagName('body')[0].style.overflow = 'auto';
}
