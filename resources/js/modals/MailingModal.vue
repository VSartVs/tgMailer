<script setup lang="ts">
import {reactive} from "vue"

const props = defineProps({
  data: {type: Object, required: true, default: {}},
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
          <CFormLabel for="floatingTextarea1"><strong>Сообщение</strong></CFormLabel>
          <CFormTextarea v-if="isEdit" rows="3"
                         id="floatingTextarea1"
                         floatingLabel="Сообщение"
                         placeholder="Сообщение"
                         v-model="data.message">
          </CFormTextarea>
          <CCol v-else>{{ data.message }}</CCol>
        </div>
        <div class="mb-3">
          <CFormLabel for="floatingSelect"><strong>Статус</strong></CFormLabel>
          <CFormSelect v-if="isEdit"
                       id="floatingSelect"
                       floatingLabel="Статус"
                       aria-label="Статус"
                       v-model="data.statusId">
            <option value="">Открыть меню выбора</option>
            <option value="1">В очереди</option>
            <option value="2">Выполняется</option>
            <option value="3">Завершена</option>
          </CFormSelect>
          <CCol v-else>{{ data.status.title }}</CCol>
        </div>
        <div class="mb-3" v-if="!isEdit">
          <CFormLabel for="chatsInput"><strong>Прогресс рассылки</strong></CFormLabel>
          <CTooltip :content="'Выполнено '+data.countCompletedChats + ' из ' +data.countChats" placement="bottom">
            <template #toggler="{ on }">
              <CProgress class="mb-3" v-on="on">
                <CProgressBar color="success" variant="striped" animated
                              :value="(data.countCompletedChats *100)/data.countChats"/>
              </CProgress>
            </template>
          </CTooltip>
        </div>
        <div class="mb-3">
          <CFormLabel for="dateInput1"><strong>Дата начала</strong></CFormLabel>
          <VueDatePicker v-if="isEdit"
                         v-model="data.requiredStartAt"
                         model-type="dd.MM.yyyy HH:mm"
                         id="dateInput1"></VueDatePicker>
          <CCol v-else>{{ data.requiredStartAt }}</CCol>
        </div>
        <div class="mb-3">
          <CFormLabel for="dateInput2"><strong>Фактическая дата начала</strong></CFormLabel>
          <VueDatePicker v-if="isEdit"
                         v-model="data.actualStartAt"
                         model-type="dd.MM.yyyy HH:mm"
                         id="dateInput2"></VueDatePicker>
          <CCol v-else>{{ data.actualStartAt }}</CCol>
        </div>
        <div class="mb-3">
          <CFormLabel for="dateInput3"><strong>Дата окончания</strong></CFormLabel>
          <VueDatePicker v-if="isEdit"
                         v-model="data.endAt"
                         model-type="dd.MM.yyyy HH:mm"
                         id="dateInput3"></VueDatePicker>
          <CCol v-else>{{ data.endAt }}</CCol>
        </div>
        <div class="mb-3">
          <CFormLabel for="imagesInput"><strong>Картинки</strong></CFormLabel>
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
              <CCarouselItem v-for="item in data.photos">
                <CImage fluid :src="item"/>
              </CCarouselItem>
            </CCarousel>
          </div>
        </div>
        <div class="mb-3">
          <CFormLabel for="inlineKeyboard"><strong>Inline Keyboard</strong></CFormLabel>
          <CFormTextarea v-if="isEdit" rows="3" id="inlineKeyboard" placeholder="Inline Keyboard"/>
          <CCol v-else><pre>{{data.inlineKeyboard}}</pre></CCol>
        </div>
        <div class="mb-3">
          <CFormLabel for="replyKeyboard"><strong>Reply Keyboard</strong></CFormLabel>
          <CFormTextarea v-if="isEdit" rows="3" id="replyKeyboard" placeholder="Reply Keyboard"/>
          <CCol v-else><pre>{{data.replyKeyboard}}</pre></CCol>
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
