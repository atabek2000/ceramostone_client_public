export default (roleId, purchaseStatusId, userId, headId) => {
    if (roleId === 6 && purchaseStatusId === 2 && headId === userId){
        return true
    } else if (roleId === 7 && (purchaseStatusId === 2 || purchaseStatusId === 4)){
        return true
    } else if (roleId === 8 && (purchaseStatusId === 4 || purchaseStatusId === 6)){
        return true
    } else if (roleId === 9 && (purchaseStatusId === 6 || purchaseStatusId === 8)){
        return true
    }
    return false
}