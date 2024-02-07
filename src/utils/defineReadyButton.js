export default (roleId, orderStatusId) => {
    if (roleId === 3 && orderStatusId === 2) {
        return true
    } else if (roleId === 4 && orderStatusId === 4) {
        return true
    } else if (roleId === 5 && orderStatusId === 6) {
        return true
    }
    return false
}