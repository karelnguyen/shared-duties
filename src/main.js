import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'
import firebase from 'firebase/app'
import firebaseConfig from '@/../config/firebase'
import 'firebase/database'
import './plugins/vuetify'
import App from '@/App.vue'
import router from '@/router'
import store from './store'
import '@/mixins'

Vue.use(Vuelidate)
Vue.use(Vuex)

Vue.config.productionTip = false
/*
  Firebase init
 */
firebase.initializeApp(firebaseConfig)
/* eslint-disable */
/*
  Initializing db
 */
const db = firebase.database().ref()
db.child('/users')
db.child('/groups')
db.child('/tasks')

const eventHub = new Vue()
Vue.prototype.$eventHub = eventHub

Vue.prototype.flash = (message, type, timeout) => {
  Vue.prototype.$eventHub.$emit('flash', message, type, timeout)
}

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
