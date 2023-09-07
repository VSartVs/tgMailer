<script setup lang="ts">
import {ref, watch} from 'vue'

const props = defineProps({
  chartsData: {
    required: true
  },
  typeOptions: {
    type: String,
    required: true,
    default: 'options-1'
  },
  typeChart: {
    required: true,
    default: 'line'
  }
})

const loading = ref(0)
const defaultData = ref({})
const defaultOptions = ref({})
const options1 = ref({
  plugins: {
    legend: {
      display: false,
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        display: false,
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
  },
  elements: {
    line: {
      borderWidth: 1,
      tension: 0.4,
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
})
const options2 = ref({
  plugins: {
    legend: {
      display: false,
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
  elements: {
    line: {
      borderWidth: 2,
      tension: 0.4,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
})
const options3 = ref({
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawTicks: false,
      },
      ticks: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
        drawBorder: false,
        drawTicks: false,
      },
      ticks: {
        display: false,
      },
    },
  },
})
const getDefaultOptions = () => {
  if(props.typeOptions === 'options-1')
    return options1.value
  else if(props.typeOptions === 'options-2')
    return options2.value
  else if(props.typeOptions === 'options-3')
    return options3.value
  else
    return options1.value
}
const getDefaultData = () => {
  if(props.typeOptions === 'options-1')
    return {
      labels: [],
      datasets: [
        {
          label: '',
          backgroundColor: 'rgba(151, 187, 205, 0.2)',
          borderColor: 'rgba(151, 187, 205, 1)',
          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
          pointBorderColor: '#fff',
          data: []
        },
      ]
    }
  else if(props.typeOptions === 'options-2')
    return {
      labels: [],
      datasets: [
        {
          label: '',
          backgroundColor: 'rgba(255,255,255,.2)',
          borderColor: 'rgba(255,255,255,.55)',
          data: [],
          fill: true,
        },
      ],
    }
  else if(props.typeOptions === 'options-3')
    return {
      labels: [],
      datasets: [
        {
          label: '',
          backgroundColor: 'rgba(255,255,255,.2)',
          borderColor: 'rgba(255,255,255,.55)',
          data: [],
          barPercentage: 0.6,
        },
      ],
    }
  else
    return {
      labels: [],
      datasets: [
        {
          label: '',
          backgroundColor: 'rgba(151, 187, 205, 0.2)',
          borderColor: 'rgba(151, 187, 205, 1)',
          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
          pointBorderColor: '#fff',
          data: []
        },
      ]
    }
}

watch(() => props.chartsData, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    defaultOptions.value = getDefaultOptions()

    defaultData.value = getDefaultData()
    defaultData.value.labels = newValue.label
    defaultData.value.datasets[0].label = newValue.value_label
    defaultData.value.datasets[0].data = newValue.value

    loading.value += 1
  }

})
</script>

<template>
  <CChart v-if="loading !== 0"
          :key="loading"
          :type="typeChart"
          class="mt-3 mx-3"
          style="height: 70px"
          :data="defaultData"
          :options="defaultOptions"
  />
</template>

<style scoped lang="scss">

</style>
