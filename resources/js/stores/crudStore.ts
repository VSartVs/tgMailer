import {defineStore} from 'pinia'
import {ref} from 'vue'
import api from '../services/auth/api'
import CustomNotification from '../services/notifications'
import router from '../router'
import {objToFD, options} from '../helpers/object-to-formdata'
export const useCrudStore = defineStore('crud', () => {

    const sortFlag = ref('desc')
    const sortProperty = ref('id')
    const data = ref([])
    const pagination = ref([])
    const currentPage = ref(1)
    const perPageCount = ref("10")
    const arrayPerPageCount = ref(["10", "20", "30", "50"])
    const isLoading = ref(false)
    const searchParams = ref({})
    const item = ref(null)
    const errors = ref([])

    const setDefaultStore = () => {
        sortFlag.value = 'desc'
        sortProperty.value = 'id'
        data.value = []
        pagination.value = []
        currentPage.value = 1
        perPageCount.value = "10"
        searchParams.value = {}
        item.value = null
        errors.value = []
    }

    const changeSort = (property) => {
        sortFlag.value = sortFlag.value === 'asc' ? 'desc' : 'asc'
        sortProperty.value = property
        getData()
    }

    const getData = async () => {
        isLoading.value = true
        const params = {
            page: currentPage.value,
            sortFlag: sortFlag.value,
            sortProperty: sortProperty.value,
            perPageCount: perPageCount.value
        }
        Object.keys(searchParams.value)
            .forEach(key => params[key] = searchParams.value[key]);
        return await api.get('admin' + router.currentRoute.value.fullPath,
            {
                params: params
            })
            .then((response) => {
                data.value = response.data.data
                pagination.value = response.data.meta
                isLoading.value = false
            }).catch((err) => {
                CustomNotification.swalMessage('error', err)
                isLoading.value = false
            })
    }

    const getItem = async (route: string) => {
        return await api.get('admin/' + route)
            .then((response) => {
                item.value = response.data
            }).catch((err) => {
                CustomNotification.swalMessage('error', err)
            })
    }

    const update = async (route: string) => {

        const formData = objToFD(item.value, options)

        return await api.put('admin/' + route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(async (response) => {
                await getItem(route)
                let message = response.data.message ?  response.data.message : 'Данные успешно обновлены!'
                CustomNotification.swalMessage('success', message)
                return Promise.resolve(response)

            }).catch((err) => {
                errors.value = err.response.data.errors
                CustomNotification.swalMessage('error', err)
            })
    }

    const updateWithoutFiles = async (route: string, data = {}) => {
        errors.value = []
        return await api.put('admin/' + route, data)
            .then(async (response) => {
               // await getItem(route)
                let message = response.data.message ?  response.data.message : 'Данные успешно обновлены!'
                CustomNotification.swalMessage('success', message)
                return Promise.resolve(response)

            }).catch((err) => {
                errors.value = err.response.data.errors
                CustomNotification.swalMessage('error', err)
            })
    }

    const multipleDestroy = async (route: string, params: object) => {
        return await api.post('admin/' + route, params)
            .then((response) => {
                getData()
            }).catch((err) => {
                CustomNotification.swalMessage('error', err)
            })
    }

    const destroy = async (route: string) => {
        return await api.delete('admin/' + route)
            .then((response) => {
                getData()

            }).catch((err) => {
                CustomNotification.swalMessage('error', err)
            })
    }

    return {
        sortFlag, sortProperty, changeSort, getData, getItem, update, destroy, multipleDestroy,
        data, pagination, currentPage, perPageCount, arrayPerPageCount, isLoading, searchParams,
        item, setDefaultStore, errors, updateWithoutFiles
    }
})
