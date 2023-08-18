<script setup lang="ts">
import { useCrudStore } from "../../stores/crudStore"
import {storeToRefs} from "pinia"

const props = defineProps({
  property: {required: true, type: String},
  name: {required: true, type: String}
})

const crudStore = useCrudStore()

const {sortFlag, sortProperty} = storeToRefs(crudStore)
</script>

<template>
  <CTableHeaderCell scope="col"
                    v-bind:class="sortProperty === property ? 'sorted' : ''"
                    v-bind:data-sorting-direction="sortFlag"
                    @click="crudStore.changeSort(property)">
    <p class="d-flex m-0 justify-content-between align-items-center">
      {{name}}
      <CIcon v-if="sortFlag !== 'desc'" icon="cilCaretBottom" size="custom-size" :height="12"/>
      <CIcon v-else icon="cilCaretTop" size="custom-size" :height="12"/>
    </p>
  </CTableHeaderCell>
</template>

<style scoped lang="scss">

</style>
