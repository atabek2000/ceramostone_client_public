export default (roleId, orderStatusId) => {
    if (roleId === 7 && orderStatusId === 2) {
        return true
    } else if (roleId === 8 && orderStatusId === 4) {
        return true
    } else if (roleId === 9 && orderStatusId === 6) {
        return true
    } else if (roleId === 10 && orderStatusId === 8) {
        return true
    } else if (roleId === 11 && orderStatusId === 9) {
        return true
    } else if (roleId === 13 && orderStatusId === 14) {
        return true
    }
    return false
}