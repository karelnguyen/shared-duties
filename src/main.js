import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import firebaseConfig from '@/../config/firebase'
import 'firebase/database'
import './plugins/vuetify'
import App from '@/App.vue'
import router from '@/router'
import store from './store'

Vue.use(Vuex)

Vue.config.productionTip = false

/*
  Firebase init
 */
firebase.initializeApp(firebaseConfig)
/* eslint-disable */
const db = firebase.database().ref()
db.child('/users')
db.child('/groups')

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
