<script setup lang='ts'>
import Pagination from '../components/tables/Pagination.vue'
import HeaderCell from '../components/tables/HeaderCell.vue'
import {onMounted} from 'vue'
import {storeToRefs} from 'pinia'
import {useCrudStore} from '../stores/crudStore'

const crudStore = useCrudStore()
const {data, isLoading, searchParams} = storeToRefs(crudStore)


onMounted(() => {
  crudStore.getData()
})
</script>

<template>
  <CRow class="mb-3 justify-content-end">
    <CCol xl="4" xxl="4">
      <CInputGroup class="align-items-center">
        <CFormInput v-model="searchParams.name" type="text" placeholder="Поиск по названию бота" aria-describedby="inputGroupSearch"/>
        <CInputGroupText id="inputGroupSearch" class="cursor-pointer bg-white p-0">
          <CButton color="link" class="d-flex border-0" @click="crudStore.getData()">
            <CIcon id="iconSearch" icon="cilSearch" size="xl"/>
          </CButton>
        </CInputGroupText>
      </CInputGroup>
    </CCol>
  </CRow>

  <template v-if="!isLoading && data.length > 0">
    <CTable bordered hover responsive>
      <CTableHead>
        <CTableRow>
          <HeaderCell property="id" name="ID"/>
          <HeaderCell property="name" name="Название бота"/>
          <HeaderCell property="countActiveMailings" name="Активные рассылки"/>
          <HeaderCell property="countQueueMailings" name="Рассылки в очереди"/>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="item in data">
          <CTableHeaderCell scope="row">{{ item.id }}</CTableHeaderCell>
          <CTableDataCell>
            <router-link :to="{ name: 'Рассылки', params: { botId: item.id }}">
              {{ item.name }}
            </router-link>
          </CTableDataCell>
          <CTableDataCell>{{ item.countActiveMailings }}</CTableDataCell>
          <CTableDataCell>{{ item.countQueueMailings }}</CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
    <Pagination></Pagination>
  </template>
  <CAlert color="info" v-if="!isLoading && data.length <= 0">По данному запросу данных не найдено</CAlert>
</template>

<style lang="scss">
.btn-link {
  --cui-btn-color: black;
  --cui-btn-active-color: var(--cui-link-color)
}
</style>
