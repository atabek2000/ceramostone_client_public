<template>
    <a-result status="404" title="404" :sub-title="$t('content.pageNotFound')">
        <template #extra>
        <router-link v-if="[1,2,3,4,5].includes($store.state.user.roleId)" to="/orders">{{$t('button.orders')}}</router-link>
        <router-link v-if="[1,6,7,8,9,10,11,12].includes($store.state.user.roleId)" to="/purchases">{{$t('button.purchases')}}</router-link>
        </template>
    </a-result>
</template>

<script>
export default {
    
}
</script>