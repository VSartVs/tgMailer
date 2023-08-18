<script setup lang="ts">

import {reactive} from "vue";

const mailing = reactive({
  message: '',
  date: '',
  photos: '',
  inlineKeyboard: {},
  replyKeyboard: {}
})

</script>

<template>
  <CModal alignment="center" id="editMailingModal">
    <CModalHeader>
      <CModalTitle>Редактирование рассылки</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm class="w-100">
        <div class="mb-3">
          <CFormLabel for="messageInput">Сообщение</CFormLabel>
          <
          <CFormTextarea rows="3" id="messageInput" placeholder="Сообщение для рассылки"/>
        </div>
        <div class="mb-3">
          <CFormLabel for="dateInput">Дата</CFormLabel>
          <VueDatePicker v-model="mailing.date"></VueDatePicker>
        </div>
        <div class="mb-3">
          <CFormLabel for="imagesInput">Картинки</CFormLabel>
          <CFormInput type="text" id="imagesInput" placeholder="Картинки"/>
        </div>
        <div class="mb-3">
          <CFormLabel for="inlineKeyboard">Inline Keyboard</CFormLabel>
          <CFormTextarea rows="3" id="inlineKeyboard" placeholder="Inline Keyboard"/>
        </div>
        <div class="mb-3">
          <CFormLabel for="replyKeyboard">Reply Keyboard</CFormLabel>
          <CFormTextarea rows="3" id="replyKeyboard" placeholder="Reply Keyboard"/>
        </div>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary">
        Закрыть
      </CButton>
      <CButton color="primary">Сохранить</CButton>
    </CModalFooter>
  </CModal>
</template>

<style scoped lang="scss">

</style>
