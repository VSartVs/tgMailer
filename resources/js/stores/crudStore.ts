import {defineStore} from 'pinia'
import {reactive, ref} from 'vue'
import api from '../services/auth/api'
import CustomNotification from '../services/notifications'
import router from '../router'

export const useCrudStore = defineStore('crud', () => {

    const sortFlag = ref('desc')
    const sortProperty = ref('id')
    const data = ref([])
    const pagination = ref([])
    const currentPage = ref(1)
    const perPageCount = ref(2)
    const arrayPerPageCount = ref([2, 10, 20, 30, 50])
    const isLoading = ref(false)
    const searchParams = ref({})

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
        return await api.get('admin'+ router.currentRoute.value.fullPath,
            {
                params: params
            })
            .then((response) => {
                data.value = response.data.data
                pagination.value = response.data.meta
                isLoading.value = false
            }).catch((err) => {
                console.log(err)
                CustomNotification.swalMessage('error', err)
                isLoading.value = false
            })
    }

    const destroy = async (route :string) => {
         return await api.delete('admin/'+route)
            .then((response) => {
                getData()

            }).catch((err) => {
                CustomNotification.swalMessage('error', err)
            })
    }


    return {
        sortFlag, sortProperty, changeSort, getData, destroy,  data, pagination, currentPage,
        perPageCount, arrayPerPageCount, isLoading, searchParams,
    }
})
