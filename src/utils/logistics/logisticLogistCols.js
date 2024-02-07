import i18n from '@/i18n/i18n'
const {t} = i18n.global

export default [
    {
        title: t('table.wagonCn'),
        dataIndex: 'wagon_num_cn',
        customFilterDropdown: true,
    },
    {
        title: t('table.delTerm'),
        dataIndex: 'logistic_term', 
    }, 
    {
        title: t('table.departStation'),
        dataIndex: 'depart_station',
        customFilterDropdown: true,
    }, 
    {
        title: t('table.dest_station'),
        dataIndex: 'dest_station',
        filters: [
            {
                text: 'Almaty',
                value: 1
            },
            {
                text: 'Astana',
                value: 2
            },
        ]
    }, 
    {
        title: t('table.sendDate'),
        dataIndex: 'send_date',
        sorter: true,
    }, 
    {
        title: t('table.reAdd'),
        dataIndex: 'dest_readdress',
    }, 
    {
        title: t('table.transLoc'),
        dataIndex: 'transport_locations',
    }, 
]