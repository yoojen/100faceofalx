function calculteMillseconds(weeks) {
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    return weeks * weekMs;
}


function getTimeDifference(weeks) {
    const ms = calculteMillseconds(weeks);
    const now = new Date();
    now.setHours(0, 0, 0, 0)
    return new Date(now.getTime() - ms);
}

module.exports = getTimeDifference;