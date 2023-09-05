<script setup lang="ts">
import {computed} from 'vue'
import {useCrudStore} from '../../stores/crudStore'
import {storeToRefs} from 'pinia'

const crudStore = useCrudStore()
const {pagination, currentPage, perPageCount, arrayPerPageCount} = storeToRefs(crudStore)

const changePage = async (page) => {
  currentPage.value = page
  await crudStore.getData()
}

const getPerPageCount = computed({
  get() {
    return perPageCount.value
  },
  set(val: string) {
    perPageCount.value = val
    crudStore.getData()
  }
})

</script>

<template>
  <CRow>
    <CCol sm="auto">
      <div class="form-floating custom-floating">
        <CFormSelect id="limit" class="select-count-row" required v-model="getPerPageCount">
          <option v-for="(count, index) in arrayPerPageCount" :value="count" :key="index">{{ count }}</option>
        </CFormSelect>
        <label class="form-label" for="limit">выводить по</label>
      </div>
    </CCol>
    <CCol>
      <Paginate
          v-model="currentPage"
          :page-count="pagination.lastPage"
          :page-range="3"
          :margin-pages="2"
          :click-handler="changePage"
          :prev-text="'<'"
          :next-text="'>'"
          :container-class="'pagination'"
          :page-class="'page-item'"
          :first-last-button="true"
          :first-button-text="'<<'"
          :last-button-text="'>>'"
      />
    </CCol>
  </CRow>
</template>

<style scoped lang="scss">

</style>
