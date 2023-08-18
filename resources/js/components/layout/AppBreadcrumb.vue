<template>
  <CBreadcrumb class="d-md-down-none me-auto mb-0" style="--cui-breadcrumb-divider: '>'">
    <CBreadcrumbItem
      v-for="(item, index) in breadcrumbs"
      :key="item"
      :href="index === breadcrumbs.length - 1 ? '' : item.path"
      :active="index === breadcrumbs.length - 1">
      {{ index === breadcrumbs.length - 1 && item.param_length > 0 ? item.param : item.name }}
    </CBreadcrumbItem>
  </CBreadcrumb>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import router from '../../router'

const breadcrumbs = ref()

const getBreadcrumbs = () => {
  const breadcrumbs = router.currentRoute.value.matched.map((route) => {
    if(route.name !== null && route.name !== "" && route.name !== undefined) {
      return {
        name: route.name,
        param: router.currentRoute.value.params[Object.keys(router.currentRoute.value.params)[Object.keys(router.currentRoute.value.params).length - 1]],
        path: `${router.options.history.base}${route.path}`,
        param_length: Object.keys(router.currentRoute.value.params).length
      }
    }
  })
  return breadcrumbs.filter(item => item !== undefined && item !== null && item !== '')
}

router.afterEach(() => {
  breadcrumbs.value = getBreadcrumbs()
})

onMounted(() => {
  breadcrumbs.value = getBreadcrumbs()
})
</script>
