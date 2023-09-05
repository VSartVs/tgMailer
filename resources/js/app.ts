import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import * as icons from '@coreui/icons'
import CoreuiVueCharts from '@coreui/vue-chartjs'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import setup from './services/auth/setup'
import Paginate from 'vuejs-paginate-next'
import vue3TsJsoneditor from 'vue3-ts-jsoneditor'

//export const myHasOwnProperty = Object.prototype.hasOwnProperty

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
setup()
app.use(CoreuiVue)
app.use(CoreuiVueCharts)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('VueDatePicker', VueDatePicker)
app.use(VueSweetalert2)
app.use(VueAxios, axios)
app.use(vue3TsJsoneditor)
app.component('Paginate',Paginate)

app.mount('#app')
