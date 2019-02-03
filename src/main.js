import Vue from 'vue'
import './plugins/vuetify'
import firebase from 'firebase/app'
import App from '@/App.vue'
import router from '@/router'
import firebaseConfig from '@/../config/firebase'

Vue.config.productionTip = false

firebase.initializeApp(firebaseConfig)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
