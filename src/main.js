import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import firebaseConfig from '@/../config/firebase'
import 'firebase/database'
import './plugins/vuetify'
import App from '@/App.vue'
import router from '@/router'
import store from './store'
import '@/mixins'

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

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
