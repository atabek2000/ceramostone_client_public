<template>
    
    <a-drawer :title="$t('title.notification')" :visible="visible" @close="onClose">
        <template #extra>
            <delete-outlined :style="{fontSize: '16px',cursor:'pointer'}" @click="onDelete"/>
        </template>
        <a-alert v-for="notice in $store.state.notices" :message="notice.title" type="info" :key="notice.id" style="margin-bottom: 10px" >
            <template #description>
                <p>{{ notice.content }}</p>
                <a-typography-text code>{{ getDate(notice.createdAt).date[0]+'.'+getDate(notice.createdAt).date[1]+'.'+getDate(notice.createdAt).date[2] }}, 
                    {{ getDate(notice.createdAt).time[0]+':'+getDate(notice.createdAt).time[1]+':'+getDate(notice.createdAt).time[2] }}</a-typography-text>
            </template>
        </a-alert>
    </a-drawer>
</template>

<script>
import getLocaleDate from '../utils/getLocaleDateFromISO'
import { DeleteOutlined } from '@ant-design/icons-vue';

export default {
    name: 'NoticesView',
    props: {
        visible: {
            type: Boolean
        }
    },
    components: {
      DeleteOutlined
    },
    methods: {
        onClose(){
            this.$emit('onClose')
        },
        onDelete(){
            this.$emit('onDelete')
        },
        getDate(iso){
            return getLocaleDate(iso)
        }
    }
}
</script>
<style>
.ant-drawer-header, .ant-drawer-body{
    background-color: #181734!important;
}
.ant-drawer-header svg{
    color: white;
}
.ant-drawer-title{
    color: white!important;
}
</style>