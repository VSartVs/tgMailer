<script setup lang="ts">
import {reactive} from "vue"

const props = defineProps({
  isVisible: Boolean,
  isEdit: {type: Boolean, required: true, default: false},
  closeModal: {type: Function, required: true}
})

const mailing = reactive({
  message: '',
  date: '',
  photos: '',
  inlineKeyboard: {},
  replyKeyboard: {}
})

</script>

<template>
  <CModal alignment="center" :visible="isVisible" @close="closeModal()">
    <CModalHeader>
      <CModalTitle>Modal title</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm class="w-100">
        <div class="mb-3">
          <CFormLabel for="messageInput">Сообщение</CFormLabel>
          <CFormTextarea v-if="isEdit" rows="3" id="messageInput" placeholder="Сообщение для рассылки"/>
          <CCol v-else>message</CCol>
        </div>
        <div class="mb-3" v-if="!isEdit">
          <CFormLabel for="chatsInput">Количество чатов</CFormLabel>
          <CCol id="chatsInput">19474</CCol>
        </div>
        <div class="mb-3">
          <CFormLabel for="dateInput">Дата</CFormLabel>
          <VueDatePicker v-if="isEdit" v-model="mailing.date"></VueDatePicker>
          <CCol v-else>date</CCol>
        </div>
        <div class="mb-3">
          <CFormLabel for="imagesInput">Картинки</CFormLabel>
          <div>
            <div v-if="isEdit" class="images__buttons">
              <CButton color="warning" class="text-white" shape="rounded-pill">
                <CIcon icon="cilPencil"></CIcon>
              </CButton>
              <CButton color="danger" class="text-white" shape="rounded-pill">
                <CIcon icon="cilTrash"></CIcon>
              </CButton>
            </div>

            <CCarousel controls indicators>
              <CCarouselItem>
                <CImage fluid src="/images/vue.jpg"/>
              </CCarouselItem>
              <CCarouselItem>
                <CImage fluid src="/images/angular.jpg"/>
              </CCarouselItem>
              <CCarouselItem>
                <CImage fluid src="/images/react.jpg"/>
              </CCarouselItem>
            </CCarousel>
          </div>
        </div>
        <div class="mb-3">
          <CFormLabel for="inlineKeyboard">Inline Keyboard</CFormLabel>
          <CFormTextarea v-if="isEdit" rows="3" id="inlineKeyboard" placeholder="Inline Keyboard"/>
          <CCol v-else>Inline Keyboard</CCol>
        </div>
        <div class="mb-3">
          <CFormLabel for="replyKeyboard">Reply Keyboard</CFormLabel>
          <CFormTextarea v-if="isEdit" rows="3" id="replyKeyboard" placeholder="Reply Keyboard"/>
          <CCol v-else>Reply Keyboard</CCol>
        </div>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" class="text-white" @click="closeModal()">
        Close
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<style scoped lang="scss">
.images__buttons {
  position: absolute;
  z-index: 100;
  right: 0;
  padding-right: calc(1rem + 5px);
  padding-top: 5px;
  display: flex;
  gap: 0.5rem;
}
</style>
