let chanceFunction = function chance(max) {
    let a = Math.floor(Math.random() * Math.floor(max));
    let b = Math.floor(Math.random() * Math.floor(max));
    if (a == b) {
        return true;
    } else {
        return false;
    }
}

module.exports = chanceFunction;