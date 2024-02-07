import i18n from '@/i18n/i18n'
const {t} = i18n.global

export default (coord_date) => {
    const a = new Date();
    const date_arr = coord_date.split('-')
    const b = new Date(date_arr[0], date_arr[1]-1, date_arr[2], 0, 0, 0, 0)
    const diff = parseInt((b-a)/86400000)
    let mes = '';
    let color = "";
    if (diff >= 0) {
        mes = t('table.daysLeft')+': '+(diff+1);
        color = "yellow";
    } else{
        mes = t('table.overdue');
        color = "orange";
    }
    return [mes, color]
}