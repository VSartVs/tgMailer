<script setup lang='ts'>

import MailingModal from '../modals/MailingModal.vue'
import Pagination from '../components/tables/Pagination.vue'
import CustomNotification from '../services/notifications.ts'
import {onMounted, reactive, ref} from 'vue'
import HeaderCell from '../components/tables/HeaderCell.vue'
import {useCrudStore} from '../stores/crudStore'
import {storeToRefs} from 'pinia'


const showMailingModal = ref(false)
const isEdit = ref(false)

const crudStore = useCrudStore()
const {data, isLoading, searchParams} = storeToRefs(crudStore)
const statusColors = ['warning', 'primary', 'success']

onMounted(() => {
  crudStore.getData()
})

const selectMailing = ref(null)

const showModal = (id, showEditModal = false) => {
  selectMailing.value = id
  showMailingModal.value = true
  isEdit.value = showEditModal
}

const closeModal = () => {
  selectMailing.value = null
  isEdit.value = !isEdit.value
  showMailingModal.value = !showMailingModal.value
}

const deleteMailing = (id) => {
  CustomNotification.actionModal().then( (res) => {
    if (res.isConfirmed)
      crudStore.destroy('bots/mailings/'+id)
  })
}
</script>

<template>
  <template v-if="!isLoading">
    <CAccordion flush :active-item-key="1" always-open class="mb-3">
      <CAccordionItem :item-key="1">
        <CAccordionHeader>
          Поиск...
        </CAccordionHeader>
        <CAccordionBody>
          <CRow class="gap-2">
            <CCol xl="12" xxl="12">
              <CFormTextarea id="floatingTextarea1"
                             floatingLabel="Сообщение"
                             placeholder="Сообщение"
                             v-model="searchParams.message">
              </CFormTextarea>
            </CCol>
            <CCol xl="12" xxl="12">
              <CFormLabel for="dateInput1">Дата начала</CFormLabel>
              <VueDatePicker range multi-calendars id="dateInput1"
                             v-model="searchParams.requiredStartAt"></VueDatePicker>
            </CCol>
            <CCol xl="12" xxl="12">
              <CFormLabel for="dateInput2">Фактическая дата начала</CFormLabel>
              <VueDatePicker range multi-calendars id="dateInput2" v-model="searchParams.actualStartAt"></VueDatePicker>
            </CCol>
            <CCol xl="12" xxl="12">
              <CFormLabel for="dateInput3">Дата окончания</CFormLabel>
              <VueDatePicker range multi-calendars id="dateInput3" v-model="searchParams.endAt"></VueDatePicker>
            </CCol>
            <CCol xl="12" xxl="12">
              <CFormSelect id="floatingSelect"
                           floatingLabel="Статус"
                           aria-label="Статус"
                           v-model="searchParams.statusId">
                <option value="">Открыть меню выбора</option>
                <option value="1">В очереди</option>
                <option value="2">Выполняется</option>
                <option value="3">Завершена</option>
              </CFormSelect>
            </CCol>
            <CCol class="d-flex justify-content-between">
              <CButton color="danger" variant="ghost" class="d-flex border-0" @click="searchParams = {}">
                <CIcon icon="cilClearAll" size="xl" class="me-1"/>
                Очистить все поля
              </CButton>
              <CButton color="info" variant="ghost" class="d-flex border-0" @click="crudStore.getData()">
                <CIcon icon="cilSearch" size="xl" class="me-1"/>
                Поиск
              </CButton>
            </CCol>
          </CRow>
        </CAccordionBody>
      </CAccordionItem>
    </CAccordion>
  </template>
  <template v-if="!isLoading && data.length > 0">
    <CTable bordered hover responsive>
      <CTableHead>
        <CTableRow>
          <HeaderCell property="id" name="ID"/>
          <HeaderCell property="message" name="Сообщение"/>
          <HeaderCell property="requiredStartAt" name="Дата начала"/>
          <HeaderCell property="actualStartAt" name="Фактическая дата начала"/>
          <HeaderCell property="endAt" name="Дата окончания"/>
          <HeaderCell property="countCompletedChats" name="Прогресс рассылки"/>
          <HeaderCell property="status" name="Статус"/>
          <CTableHeaderCell scope="col">Действия</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="item in data">
          <CTableHeaderCell scope="row">{{ item.id }}</CTableHeaderCell>
          <CTableDataCell>{{ item.message }}</CTableDataCell>
          <CTableDataCell>{{ item.requiredStartAt }}</CTableDataCell>
          <CTableDataCell>{{ item.actualStartAt ? item.actualStartAt : 'Не началась' }}</CTableDataCell>
          <CTableDataCell>{{ item.endAt ? item.endAt : 'Не закончилась' }}</CTableDataCell>
          <CTableDataCell>
            <CTooltip :content="'Выполнено '+item.countCompletedChats + ' из ' +item.countChats" placement="bottom">
              <template #toggler="{ on }">
                <CProgress class="mb-3" v-on="on">
                  <CProgressBar color="success" variant="striped" animated
                                :value="(item.countCompletedChats *100)/item.countChats"/>
                </CProgress>
              </template>
            </CTooltip>
          </CTableDataCell>
          <CTableDataCell>
            <CBadge :color="statusColors[item.statusId-1]" shape="rounded-pill">{{ item.status.title }}</CBadge>
          </CTableDataCell>
          <CTableDataCell>
            <CCol class="d-flex gap-2">
              <CTooltip content="Просмотр" placement="bottom">
                <template #toggler="{ on }">
                  <CButton color="info" v-on="on" class="text-white" shape="rounded-pill" @click="showModal(item.id)">
                    <CIcon icon="cilInfo"></CIcon>
                  </CButton>
                </template>
              </CTooltip>
              <CTooltip content="Редактировать" placement="bottom">
                <template #toggler="{ on }">
                  <CButton color="warning" v-on="on" class="text-white" shape="rounded-pill" @click="showModal(item.id, true)">
                    <CIcon icon="cilPencil"></CIcon>
                  </CButton>
                </template>
              </CTooltip>
              <CTooltip content="Удалить" placement="bottom">
                <template #toggler="{ on }">
                  <CButton color="danger" v-on="on" class="text-white" shape="rounded-pill" @click="deleteMailing(item.id)">
                    <CIcon icon="cilTrash"></CIcon>
                  </CButton>
                </template>
              </CTooltip>
              <CTooltip content="Возобновить" placement="bottom">
                <template #toggler="{ on }">
                  <CButton color="primary" v-on="on" class="text-white" shape="rounded-pill" @click="">
                    <CIcon icon="cilActionRedo"></CIcon>
                  </CButton>
                </template>
              </CTooltip>
            </CCol>
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
    <Pagination></Pagination>
  </template>
  <CAlert color="info" v-if="!isLoading && data.length <= 0">По данному запросу данных не найдено</CAlert>

  <MailingModal
      :data="data[data.map((o) => o.id).indexOf(selectMailing)]"
      :is-visible="showMailingModal"
      :is-edit="isEdit"
      :close-modal="closeModal"/>
</template>

<style scoped lang="scss">

</style>
