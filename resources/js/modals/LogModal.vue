<script setup lang="ts">


const props = defineProps({
  log: {
    required: true
  },
  isVisible: {
    type: Boolean,
    required: true
  },
  closeModal: {
    type: Function,
    required: true
  }
})

</script>

<template>
  <CModal alignment="center" :visible="isVisible && log !== null" @close="closeModal()">
    <CModalHeader>
      <CModalTitle>Лог № {{ log.id }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm class="w-100">
        <div class="mb-3">
          <CFormLabel for="message">
            <strong>Сообщение</strong>
          </CFormLabel>
          <CCol>{{ log.message }}</CCol>
        </div>
        <div class="mb-3">
          <CFormLabel for="floatingSelect">
            <strong>Тип лога</strong>
          </CFormLabel>
          <CCol>{{ log.type }}</CCol>
        </div>
        <div class="mb-3">
          <CFormLabel for="requiredStartAt">
            <strong>Дата создания</strong>
          </CFormLabel>
          <CCol>{{ log.createdAt }}</CCol>
        </div>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" class="text-white" @click="closeModal()">
        Закрыть
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<style scoped lang="scss">

</style>
