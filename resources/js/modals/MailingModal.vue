<script setup lang="ts">
import {reactive, ref, watch} from 'vue'
import Uploader from '../components/inputs/Uploader.vue'
import {useCrudStore} from '../stores/crudStore'
import {storeToRefs} from 'pinia'
import CustomNotification from '../services/notifications'

const props = defineProps({
  mailingId: {
    type: [Number, null],
    required: true
  },
  isVisible: {
    type: Boolean
  },
  isEdit: {
    type: Boolean,
    required: true,
    default: false
  },
  closeModal: {
    type: Function,
    required: true
  }
})

const crudStore = useCrudStore()
const {item, errors} = storeToRefs(crudStore)

const mediaState = () => ({
  saved: [],
  added: []
})

const media = reactive(mediaState())

watch(() => props.isVisible, (newValue, oldValue) => {
  if (newValue || !newValue)
    Object.assign(media, mediaState())
})

watch(() => props.mailingId, async (newValue, oldValue) => {
  if (newValue) {
    await crudStore.getItem('bots/mailings/' + newValue)
    item.value.photosFiles = []
    item.value.photos.forEach((value, index) => {
      media.saved.push({name: value})
    })
  }
})

const onJsonInlineKeyboard = (value) => {
  if (typeof value === 'string') {
    item.value.inlineKeyboard = JSON.parse(value)
  } else if (typeof value === 'object') {
    item.value.inlineKeyboard = value
  }
}

const onJsonReplyKeyboard = (value) => {
  if (typeof value === 'string') {
    item.value.replyKeyboard = JSON.parse(value)
  } else if (typeof value === 'object') {
    item.value.replyKeyboard = value
  }
}

const addMedia = (addedImage, addedMedia) => {
  media.added = addedMedia
}

const removeMedia = (removedImage, removedMedia) => {
  item.value.photos.filter((x, i) => {
    if (x === removedImage.name)
      item.value.photos.splice(i, 1)
  })
  if (item.value.photos.length === 0)
    item.value.photos = []
}

const myReference = ref(null)

const submitForm = () => {
  errors.value = []
  if (media.added.length > 0) {
    item.value.photosFiles = []
    media.added.forEach((value, index) => {
      item.value.photosFiles.push(value.file)
    })
  }
  if (item.value.replyKeyboard !== null && item.value.replyKeyboard.length === 0)
    item.value.replyKeyboard = null
  if (item.value.inlineKeyboard !== null && item.value.inlineKeyboard.length === 0)
    item.value.inlineKeyboard = null
  if (item.value.photos.length === 0 && item.value.photosFiles.length === 0) {
    CustomNotification.swalMessage(
        'error',
        'Минимальное количество картинок: 1'
    )
  }

  crudStore.update('bots/mailings/' + item.value.id).then(() => {
    item.value.photosFiles = []
    Object.assign(media, mediaState())
    item.value.photos.forEach((value, index) => {
      media.saved.push({name: value})
    })
    myReference.value.clearMediaAndDownload()
  })


}
</script>

<template>
  <CModal alignment="center" :visible="isVisible && item !== null" @close="closeModal()">
    <CModalHeader>
      <CModalTitle>Рассылка № {{ item.id }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm class="w-100">
        <div class="mb-3">
          <CFormLabel for="message">
            <strong>Сообщение</strong>
          </CFormLabel>
          <CFormTextarea v-if="isEdit" rows="3"
                         id="message"
                         floatingLabel="Сообщение"
                         placeholder="Сообщение"
                         v-model="item.message"
                         :valid="!Object.prototype.hasOwnProperty.call(errors, 'message')"
                         :invalid="Object.prototype.hasOwnProperty.call(errors, 'message')"
                         :feedback="Object.prototype.hasOwnProperty.call(errors, 'message') ? errors.message.join(';\n') : ''"
          >
          </CFormTextarea>
          <CCol v-else>{{ item.message }}</CCol>
        </div>
        <div class="mb-3">
          <CFormLabel for="floatingSelect">
            <strong>Статус </strong>
            <CTooltip v-if="isEdit" content="Статус 'Выполняется' может быть установлен только программно, при установке его вручную он будет проигнорирован" placement="bottom">
              <template #toggler="{ on }">
                <CIcon icon="cilInfo" v-on="on"></CIcon>
              </template>
            </CTooltip>
          </CFormLabel>
          <CFormSelect v-if="isEdit"
                       id="floatingSelect"
                       floatingLabel="Статус"
                       aria-label="Статус"
                       :value="item.statusId"
                       @change="(e) => item.statusId = Number(e.target.value)"
                       :valid="!Object.prototype.hasOwnProperty.call(errors, 'statusId')"
                       :invalid="Object.prototype.hasOwnProperty.call(errors, 'statusId')"
                       :feedback="Object.prototype.hasOwnProperty.call(errors, 'statusId') ? errors.statusId.join(';\n') : ''"
          >
            <option value="0">Открыть меню выбора</option>
            <option value="1">В очереди</option>
            <option value="2">Выполняется</option>
            <option value="3">Завершена</option>
            <option value="5">Отменена</option>
          </CFormSelect>
          <CCol v-else>{{ item.status.title }}</CCol>
        </div>
        <div class="mb-3" v-if="!isEdit">
          <CFormLabel for="chatsInput"><strong>Прогресс рассылки</strong></CFormLabel>
          <CTooltip :content="'Выполнено ' + item.countCompletedChats + ' из ' + item.countChats" placement="bottom">
            <template #toggler="{ on }">
              <CProgress class="mb-3" v-on="on">
                <CProgressBar color="success" variant="striped" animated
                              :value="(item.countCompletedChats * 100) / item.countChats"/>
              </CProgress>
            </template>
          </CTooltip>
        </div>
        <div class="mb-3">
          <CFormLabel for="requiredStartAt">
            <strong>Дата начала </strong>
            <CTooltip v-if="isEdit" content="Дата начала будет изменена только при статусе 'В очереди'" placement="bottom">
              <template #toggler="{ on }">
                <CIcon icon="cilInfo" v-on="on"></CIcon>
              </template>
            </CTooltip>
          </CFormLabel>
          <VueDatePicker v-if="isEdit"
                         v-model="item.requiredStartAt"
                         model-type="dd.MM.yyyy HH:mm"
                         id="requiredStartAt"
                         :min-date="new Date()"
                         required
          ></VueDatePicker>
          <CCol v-else>{{ item.requiredStartAt }}</CCol>
        </div>
        <div class="mb-3" v-if="isEdit || item.photos !== null">
          <CFormLabel for="imagesInput"><strong>Картинки</strong></CFormLabel>
          <Uploader
              v-if="isEdit"
              :media="media.saved"
              @add="addMedia"
              @remove="removeMedia"
              ref="myReference"
          />
          <CCarousel controls indicators v-else>
            <CCarouselItem v-for="(item, index) in item.photos">
              <CImage fluid :src="item"/>
            </CCarouselItem>
          </CCarousel>

        </div>
        <div class="mb-3" v-if="isEdit || item.inlineKeyboard !== null">
          <CFormLabel for="inlineKeyboard"><strong>Inline Keyboard</strong></CFormLabel>
          <JsonEditor
              v-if="isEdit"
              height="400"
              mode="tree"
              v-model:json="item.inlineKeyboard"
              :fullWidthButton="false"
              :darkTheme="true"
              @update:model-value="onJsonInlineKeyboard"
          />
          <CCol v-else>
            <pre>{{ item.inlineKeyboard }}</pre>
          </CCol>
        </div>
        <div class="mb-3" v-if="isEdit || item.replyKeyboard !== null">
          <CFormLabel for="replyKeyboard"><strong>Reply Keyboard</strong></CFormLabel>
          <JsonEditor
              v-if="isEdit"
              height="400"
              mode="tree"
              v-model:json="item.replyKeyboard"
              :fullWidthButton="false"
              :darkTheme="true"
              @update:model-value="onJsonReplyKeyboard"
          />
          <CCol v-else>
            <pre>{{ item.replyKeyboard }}</pre>
          </CCol>
        </div>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton v-if="isEdit" color="success" class="text-white" @click="submitForm()">
        Изменить
      </CButton>
      <CButton color="secondary" class="text-white" @click="closeModal()">
        Закрыть
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
