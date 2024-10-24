<template>
  <div class="app">
    <NuxtPage />
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp();

useHead({
  meta: [
    {
      property: 'og:title',
      content: '台灣歷年總統 都幾?',
    },
    {
      property: 'og:description',
      content: '台灣歷年總統票數統計，總統即時開票全台地圖。',
    },
    {
      property: 'title',
      content: '台灣歷年總統 都幾?',
    },
    {
      property: 'description',
      content: '台灣歷年總統票數統計，總統即時開票全台地圖。',
    },
    {
      property: 'og:image',
      content: '/web.jpg',
    },
  ],
});
</script>

<style></style>
