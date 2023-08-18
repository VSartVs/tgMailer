<script setup lang="ts">
import Pagination from "../components/tables/Pagination.vue"
import HeaderCell from "../components/tables/HeaderCell.vue";
</script>

<template>
  <CTable>
    <CTableHead>
      <CTableRow>
        <HeaderCell property="id" name="ID"/>
        <HeaderCell property="name" name="Название бота"/>
        <HeaderCell property="countActiveMailings" name="Активные рассылки"/>
        <HeaderCell property="countQueueMailings" name="Рассылки в очереди"/>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      <CTableRow>
        <CTableHeaderCell scope="row">1</CTableHeaderCell>
        <CTableDataCell>
          <router-link :to="{ name: 'Рассылки', params: { botId: 123 }}">
            Mark
          </router-link>
        </CTableDataCell>
        <CTableDataCell>12</CTableDataCell>
        <CTableDataCell>1</CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>
  <CRow>
    <CCol>
      <Pagination></Pagination>
    </CCol>
  </CRow>
</template>
