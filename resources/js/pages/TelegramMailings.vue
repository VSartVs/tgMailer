<script setup lang='ts'>
import MailingModal from '../modals/MailingModal.vue'
import Pagination from '../components/tables/Pagination.vue'
import CustomNotification from '../services/notifications.ts'
import {onMounted, onUnmounted, ref} from 'vue'
import HeaderCell from '../components/tables/HeaderCell.vue'
import {useCrudStore} from '../stores/crudStore'
import {storeToRefs} from 'pinia'
import router from '../router'

const showMailingModal = ref(false)
const isEdit = ref(false)

const crudStore = useCrudStore()
const {data, isLoading, searchParams, item} = storeToRefs(crudStore)
const statusColors = ['warning', 'primary', 'success']
const dateToDelete = ref(null)

onMounted(() => {
  crudStore.getData()
})

onUnmounted(() => {
  crudStore.setDefaultStore()
})

const selectMailing = ref(null)

const showModal = (id, showEditModal = false) => {
  selectMailing.value = id
  showMailingModal.value = true
  isEdit.value = showEditModal
}

const closeModal = () => {
  selectMailing.value = null
  item.value = null
  showMailingModal.value = !showMailingModal.value
  isEdit.value = !isEdit.value
  crudStore.getData()
}

const deleteMailing = (id) => {
  CustomNotification.actionModal().then((res) => {
    if (res.isConfirmed)
      crudStore.destroy('bots/mailings/' + id)
  })
}

const multipleDestroy = () => {
  if (dateToDelete.value === null) {
    CustomNotification.swalMessage('error', 'Для массового удаления необходимо заполнить дату')
  } else {
    CustomNotification.actionModal('warning',
        'Вы действительно хотите удалить все рассылки, дата окончания которых ранее, чем ' + dateToDelete.value + '?',
        'Отменить действие будет невозможно.').then((res) => {
      if (res.isConfirmed)
        crudStore.multipleDestroy('bots/mailings/multiple/destroy',
            {
              dateToDelete: dateToDelete.value,
              botId: router.currentRoute._rawValue.params.botId
            })
            .then(() => {
              dateToDelete.value = null
            })

    })
  }
}

const rebootMailing = (id) => {
  CustomNotification.actionModal('warning',
      'Вы действительно хотите перезапустить рассылку?',
      'Она сразу отправится в очередь на выполнение',
      'Рассылка была перезапущена и поставлена в очередь',
      'Возобновление рассылки отменено'
  ).then((res) => {
    if (res.isConfirmed)
      crudStore.updateWithoutFiles('bots/mailings/restart/' + id)
          .then(() => {
            crudStore.getData()
          })

  })
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
            <CFormTextarea id="message"
                           floatingLabel="Сообщение"
                           placeholder="Сообщение"
                           v-model="searchParams.message">
            </CFormTextarea>
          </CCol>
          <CCol xl="12" xxl="12">
            <CFormLabel for="requiredStartAt">Дата начала</CFormLabel>
            <VueDatePicker range multi-calendars id="requiredStartAt"
                           v-model="searchParams.requiredStartAt"></VueDatePicker>
          </CCol>
          <CCol xl="12" xxl="12">
            <CFormLabel for="actualStartAt">Фактическая дата начала</CFormLabel>
            <VueDatePicker range multi-calendars id="actualStartAt"
                           v-model="searchParams.actualStartAt"></VueDatePicker>
          </CCol>
          <CCol xl="12" xxl="12">
            <CFormLabel for="endAt">Дата окончания</CFormLabel>
            <VueDatePicker range multi-calendars id="endAt" v-model="searchParams.endAt"></VueDatePicker>
          </CCol>
          <CCol xl="12" xxl="12">
            <CFormSelect id="statusId"
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

  <template v-if="!isLoading && data.length > 0">
    <CForm class="d-flex justify-content-end mb-3">
      <CCol xl="auto" xxl="auto" lg="auto" md="auto" sm="auto" class="p-0">
        <CFormLabel for="dateToDelete">
          <strong>Удалить все рассылки, дата окончания которых ранее, чем </strong>
        </CFormLabel>
        <CRow class="gap-2 m-0">
          <CCol xl="" xxl="" lg="" md="" sm="" class="p-0">
            <VueDatePicker v-model="dateToDelete"
                           id="dateToDelete"
                           :max-date="new Date()"
                           model-type="dd.MM.yyyy HH:mm"
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
            <CTooltip :content="'Выполнено '+ item.countCompletedChats + ' из ' + item.countChats" placement="bottom">
              <template #toggler="{ on }">
                <CProgress class="mb-3" v-on="on">
                  <CProgressBar color="success" variant="striped" animated
                                :value="(item.countCompletedChats * 100) / item.countChats"/>
                </CProgress>
              </template>
            </CTooltip>
          </CTableDataCell>
          <CTableDataCell>
            <CBadge v-if="statusColors.length > item.statusId -1" :color="statusColors[item.statusId-1]"
                    shape="rounded-pill">{{ item.status?.title }}
            </CBadge>
            <CBadge v-else color="danger" shape="rounded-pill">{{ item.status?.title }}</CBadge>
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
                  <CButton color="warning" v-on="on" class="text-white" shape="rounded-pill"
                           @click="showModal(item.id, true)">
                    <CIcon icon="cilPencil"></CIcon>
                  </CButton>
                </template>
              </CTooltip>
              <CTooltip content="Удалить" placement="bottom">
                <template #toggler="{ on }">
                  <CButton color="danger" v-on="on" class="text-white" shape="rounded-pill"
                           @click="deleteMailing(item.id)">
                    <CIcon icon="cilTrash"></CIcon>
                  </CButton>
                </template>
              </CTooltip>
              <CTooltip content="Возобновить" placement="bottom" v-if="item.statusId >= 3">
                <template #toggler="{ on }">
                  <CButton color="primary" v-on="on" class="text-white" shape="rounded-pill"
                           @click="rebootMailing(item.id)">
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
      :mailing-id="selectMailing"
      :is-visible="showMailingModal"
      :is-edit="isEdit"
      :close-modal="closeModal"/>
</template>

<style scoped lang="scss">

</style>
