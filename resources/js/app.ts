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


const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(CoreuiVue)
app.use(CoreuiVueCharts)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('VueDatePicker', VueDatePicker)
app.use(VueSweetalert2)
app.use(VueAxios, axios)

app.mount('#app')


axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  console.log(error.response.data.message)
  if (error.response.data.message === 'Unauthenticated.') {
    Swal({
      title: "Session Expired",
      text: "Your session has expired. Would you like to be redirected to the login page?",
      icon: "warning",
      showCancelButton: true,
      closeOnConfirm: false
    }).then((result) => {
      if (result.value) {
        //window.location.href = "/login"
      }
    });
  }
  return Promise.reject(error)
})
