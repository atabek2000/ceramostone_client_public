<template>
    <h1>Новости</h1>
    <a-list item-layout="vertical" size="large" :data-source="news">
      <template #renderItem="{ item }">
        <a-list-item key="item.title">
          <template #actions>
            <img
              v-if="!loading"
              width="272"
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
          </template>
          <a-skeleton :loading="loading" active>
            <a-list-item-meta :description="item.description">
              <template #title>
                <a :href="item.title">{{ item.title }}</a>
              </template>
            </a-list-item-meta>
            <p style="white-space:pre">
                {{ item.content }}
                
            </p>
          </a-skeleton>
        </a-list-item>
      </template>
    </a-list>
       
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
  },
  setup() {
    const news = [
        {
            id: 1,
            title: "Новость дня",
            description: "2022-03-01",
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. \nBlanditiis corrupti exercitationem rem magni facilis ex asperiores fugiat illum rerum ipsam, itaque quos dignissimos ab quo, perspiciatis at iste architecto sunt! "
        },
        {
            id: 2,
            title: "Some title 2",
            description: "Some description 2",
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. \nBlanditiis corrupti exercitationem rem magni facilis ex asperiores fugiat illum rerum ipsam, itaque quos dignissimos ab quo, perspiciatis at iste architecto sunt! "
        },
        {
            id: 3,
            title: "Some title 3",
            description: "Some description 3",
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. \nBlanditiis corrupti exercitationem rem magni facilis ex asperiores fugiat illum rerum ipsam, itaque quos dignissimos ab quo, perspiciatis at iste architecto sunt! "
        },
    ]
    const loading = ref(true)

    setTimeout(function(){loading.value = false}, 2000)

    return {
        news,
        loading
    }
  }
})
</script>

<style>

</style>