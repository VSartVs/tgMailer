import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useCrudStore = defineStore('crud', () => {

    const sortFlag = ref('desc')
    const sortProperty = ref('id')


    const changeSort = (property) => {
        sortFlag.value = sortFlag.value === 'asc' ? 'desc' : 'asc'
        sortProperty.value = property
    }

    return { sortFlag, sortProperty, changeSort }
})
