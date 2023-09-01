<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useCrudStore} from '../stores/crudStore'
import VueSplash from '../components/layout/VueSplash.vue'

const crudStore = useCrudStore()
const {isLoading} = storeToRefs(crudStore)

</script>
<template>
  <vue-splash
      :show="isLoading"
      logo="/icons/telegram.svg"
      title="Загрузка..."
      color="#84b5e3"
      :size="500"
  />
  <router-view/>
</template>

