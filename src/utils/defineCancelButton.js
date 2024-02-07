
export default (roleId, orderStatusId, userId, managerId) => {
    if (roleId === 2 && orderStatusId === 2 && managerId === userId){
        return true
    } else if (roleId === 3 && (orderStatusId === 2)){
        return true
    } else if (roleId === 4 && (orderStatusId === 4 || orderStatusId === 6 || orderStatusId === 9)){
        return true
    } else if (roleId === 5 && (orderStatusId === 9)){
        return true
    }
    return false
}