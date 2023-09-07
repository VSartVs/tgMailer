<script setup lang="ts">

import HeaderCell from '../components/tables/HeaderCell.vue'
import Pagination from '../components/tables/Pagination.vue'
import {onMounted, onUnmounted, ref} from 'vue'
import {useCrudStore} from '../stores/crudStore'
import {storeToRefs} from 'pinia'
import CustomNotification from '../services/notifications'
import LogModal from '../modals/LogModal.vue'

const isVisibleModal = ref(false)

const crudStore = useCrudStore()
const {data, isLoading, searchParams} = storeToRefs(crudStore)
const dateToDelete = ref(null)
const selectedLog = ref(null)

onMounted(() => {
  crudStore.getData()
})

onUnmounted(() => {
  crudStore.setDefaultStore()
})


const showModal = (item) => {
  selectedLog.value = item
  isVisibleModal.value = true
}

const closeModal = () => {
  selectedLog.value = null
  isVisibleModal.value = !isVisibleModal.value
}

const deleteLog = (id) => {
  CustomNotification.actionModal().then((res) => {
    if (res.isConfirmed)
      crudStore.destroy('logs/' + id)
  })
}

const multipleDestroy = () => {
  if (dateToDelete.value === null) {
    CustomNotification.swalMessage('error', 'Для массового удаления необходимо заполнить дату')
  } else {
    CustomNotification.actionModal('warning',
      'Вы действительно хотите удалить все логи, дата создания которых ранее, чем ' + dateToDelete.value + '?',
      'Отменить действие будет невозможно.').then((res) => {
      if (res.isConfirmed)
        crudStore.multipleDestroy('logs/multiple/destroy',
          {
            dateToDelete: dateToDelete.value
          })
          .then(() => {
            dateToDelete.value = null
          })

    })
  }
}
</script>

<template>
  <CAccordion flush :active-item-key="1" always-open class="mb-3">
    <CAccordionItem :item-key="1">
      <CAccordionHeader>
        Поиск...
      </CAccordionHeader>
      <CAccordionBody>
        <CRow class="gap-2">
          <CCol xl="12" xxl="12">
            <CFormInput id="mailingId"
                        floating-label="Номер рассылки"
                        placeholder="Номер рассылки"
                        v-model="searchParams.mailingId"
                        type="number">

            </CFormInput>
          </CCol>
          <CCol xl="12" xxl="12">
            <CFormLabel for="createdAt">Дата создания</CFormLabel>
            <VueDatePicker range multi-calendars id="createdAt"
                           model-type="yyyy-MM-dd HH:mm:ss"
                           v-model="searchParams.createdAt"></VueDatePicker>
          </CCol>
          <CCol xl="12" xxl="12">
            <CFormSelect id="type"
                         floatingLabel="Тип лога"
                         aria-label="Тип лога"
                         v-model="searchParams.type">
              <option value="">Открыть меню выбора</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="error">Error</option>
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

  <template v-if="!isLoading && data.length > 0">
    <CForm class="d-flex justify-content-end mb-3">
      <CCol xl="auto" xxl="auto" lg="auto" md="auto" sm="auto" class="p-0">
        <CFormLabel for="dateToDelete">
          <strong>Удалить все логи, дата создания которых ранее, чем </strong>
        </CFormLabel>
        <CRow class="gap-2 m-0">
          <CCol xl="" xxl="" lg="" md="" sm="" class="p-0">
            <VueDatePicker v-model="dateToDelete"
                           id="dateToDelete"
                           :max-date="new Date()"
                           model-type="yyyy-MM-dd HH:mm:ss"
                           required
            ></VueDatePicker>
          </CCol>
          <CCol xl="auto" xxl="auto" lg="auto" md="auto" sm="auto" class="d-flex p-0">
            <CButton class="w-100" color="primary" @click="multipleDestroy()">Удалить</CButton>
          </CCol>
        </CRow>
      </CCol>
    </CForm>
    <CTable bordered hover responsive>
      <CTableHead>
        <CTableRow>
          <HeaderCell property="id" name="ID"/>
          <HeaderCell property="message" name="Сообщение"/>
          <HeaderCell property="type" name="Тип лога"/>
          <HeaderCell property="createdAt" name="Дата создания"/>
          <CTableHeaderCell scope="col">Действия</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="item in data">
          <CTableHeaderCell scope="row">{{ item.id }}</CTableHeaderCell>
          <CTableDataCell>{{ item.message }}</CTableDataCell>
          <CTableDataCell>
            <CBadge :color="item.type === 'error' ? 'danger' : item.type" shape="rounded-pill">{{ item.type }}</CBadge>
          </CTableDataCell>
          <CTableDataCell>{{ item.createdAt === null ? '-' :  item.createdAt}}</CTableDataCell>
          <CTableDataCell>
            <CCol class="d-flex gap-2">
              <CButton color="info" class="text-white" shape="rounded-pill" @click="showModal(item)">
                <CIcon icon="cilInfo"></CIcon>
              </CButton>
              <CButton color="danger" class="text-white" shape="rounded-pill"
                       @click="deleteLog(item.id)">
                <CIcon icon="cilTrash"></CIcon>
              </CButton>
            </CCol>
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
    <Pagination></Pagination>
  </template>
  <CAlert color="info" v-if="!isLoading && data.length <= 0">По данному запросу данных не найдено</CAlert>
  <LogModal :close-modal="closeModal" :log="selectedLog" :is-visible="isVisibleModal"></LogModal>
</template>

