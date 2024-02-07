<template>
    <div class="container">
        <CompanyLogo/>
        <NewsList/>
    </div>
</template>

<script>
import CompanyLogo from '@/components/CompanyLogo.vue';
import NewsList from '../components/news/ListNews.vue'
export default {
    components: {
    NewsList,
    CompanyLogo
},

}
</script>