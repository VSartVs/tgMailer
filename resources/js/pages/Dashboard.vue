<script setup lang='ts'>
import {onMounted, ref,} from 'vue'
import {useCrudStore} from '../stores/crudStore'
import {storeToRefs} from 'pinia'
import WidgetStats from "../components/statistics/WidgetStats.vue"

const crudStore = useCrudStore()
const {item} = storeToRefs(crudStore)

const botsData = ref({})
const mailingsData = ref({})
const completedMailingsData = ref({})
const failedMailingsData = ref({})

onMounted(async () => {
  botsData.value = await crudStore.getItem('statistics').then(async () => {
    return Promise.resolve({
      label: Object.keys(item.value.botStatistics),
      value_label: "Количество ботов",
      value: Object.values(item.value.botStatistics)
    })
  })
  mailingsData.value = await crudStore.getItem('statistics').then(async () => {
    return Promise.resolve({
      label: Object.keys(item.value.mailingsStatistics),
      value_label: "Количество рассылок",
      value: Object.values(item.value.mailingsStatistics)
    })
  })
  completedMailingsData.value = await crudStore.getItem('statistics').then(async () => {
    return Promise.resolve({
      label: Object.keys(item.value.completedMailingsStatistics),
      value_label: "Количество выполненных рассылок",
      value: Object.values(item.value.completedMailingsStatistics)
    })
  })
  failedMailingsData.value = await crudStore.getItem('statistics').then(async () => {
    return Promise.resolve({
      label: Object.keys(item.value.failedMailingsStatistics),
      value_label: "Количество неудачных рассылок",
      value: Object.values(item.value.failedMailingsStatistics)
    })
  })
})

</script>

<template>
  <CRow>
    <CCol :xs="3">
      <WidgetStats
          color="primary"
          title="Боты"
          type-options="options-1"
          type-chart="line"
          :chartsData="botsData"
          :counter="item ? item.botsCounter : 0"
      />
    </CCol>
    <CCol :xs="3">
      <WidgetStats
          color="info"
          title="Рассылки"
          type-options="options-1"
          type-chart="line"
          :chartsData="mailingsData"
          :counter="item ? item.mailingsCounter : 0"
      />
    </CCol>
    <CCol :xs="3">
      <WidgetStats
          color="warning"
          title="Выполненные рассылки"
          type-options="options-2"
          type-chart="line"
          :chartsData="completedMailingsData"
          :counter="item ? item.completedMailingsCounter :  0"
      />
    </CCol>
    <CCol :xs="3">
      <WidgetStats
          color="danger"
          title="Неудачные рассылки"
          type-options="options-3"
          type-chart="bar"
          :chartsData="failedMailingsData"
          :counter="item ? item.failedMailingsCounter :  0"
      />
    </CCol>
  </CRow>
</template>
