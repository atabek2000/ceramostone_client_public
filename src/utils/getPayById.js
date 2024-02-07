import i18n from '@/i18n/i18n'
const {t} = i18n.global

export default (id) => {
    let st = ''
switch (id){
    case 0 : st = ""; 
    break;
    case 1 : st = t('content.byAgreementShort');
    break;
    case 2 :  st = t('content.byAdvanceShort');
}
return st
}
