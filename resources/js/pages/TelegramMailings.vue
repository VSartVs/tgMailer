<script setup lang="ts">

import MailingModal from "../modals/MailingModal.vue"
import Pagination from "../components/tables/Pagination.vue"
import CustomNotification from "../services/notifications.ts"
import {ref} from "vue"
import HeaderCell from "../components/tables/HeaderCell.vue";


const showMailingModal = ref(false)
const isEdit = ref(false)

const showModal = (showEditModal = false) => {
  showMailingModal.value = true
  isEdit.value = showEditModal
}

const closeModal = () => {
  isEdit.value = !isEdit.value
  showMailingModal.value = !showMailingModal.value
}

const deleteMailing = () => {
  CustomNotification.actionModal()
}
</script>

<template>
  <CTable bordered hover responsive class="table-fixed mb-0">
    <CTableHead>
      <CTableRow>
        <HeaderCell property="id" name="ID"/>
        <HeaderCell property="message" name="Сообщение"/>
        <HeaderCell property="date" name="Дата"/>
        <HeaderCell property="countChats" name="Количество чатов"/>
        <HeaderCell property="status" name="Статус"/>
        <CTableHeaderCell scope="col">Действия</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      <CTableRow>
        <CTableHeaderCell scope="row">1</CTableHeaderCell>
        <CTableDataCell>Сообщение</CTableDataCell>
        <CTableDataCell>18.08.2023</CTableDataCell>
        <CTableDataCell>13</CTableDataCell>
        <CTableDataCell>
          <CBadge color="primary" shape="rounded-pill">Выполняется</CBadge>
          <CBadge color="success" shape="rounded-pill">Завершена</CBadge>
          <CBadge color="warning" shape="rounded-pill">В очереди</CBadge>
        </CTableDataCell>
        <CTableDataCell>
          <CCol class="d-flex gap-2">
            <CButton color="info" class="text-white" shape="rounded-pill" @click="showModal()">
              <CIcon icon="cilInfo"></CIcon>
            </CButton>
            <CButton color="warning" class="text-white" shape="rounded-pill" @click="showModal(true)">
              <CIcon icon="cilPencil"></CIcon>
            </CButton>
            <CButton color="danger" class="text-white" shape="rounded-pill" @click="deleteMailing()">
              <CIcon icon="cilTrash"></CIcon>
            </CButton>
          </CCol>
        </CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>
  <CRow>
    <CCol>
      <Pagination></Pagination>
    </CCol>
  </CRow>
  <MailingModal :is-visible="showMailingModal" :is-edit="isEdit" :close-modal="closeModal"></MailingModal>
</template>

<style scoped lang="scss">

</style>
