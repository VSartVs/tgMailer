<script setup lang="ts">
import ChartStats from './ChartStats.vue'

const props = defineProps({
  color: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  chartsData: {
    required: true
  },
  typeOptions: {
    type: String,
    required: true,
    default: 'options-1'
  },
  typeChart: {
    type: String,
    required: true,
    default: 'line'
  },
  counter: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <CWidgetStatsA class="mb-3" :color="color">
    <template #value>
      {{counter}}
    </template>
    <template #title>{{ title }}</template>
    <template #chart>
      <ChartStats
          :type-options="typeOptions"
          :charts-data="chartsData"
          :type-chart="typeChart"/>
    </template>
  </CWidgetStatsA>
</template>

<style scoped lang="scss">

</style>
