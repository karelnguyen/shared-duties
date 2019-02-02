import Vue from 'vue'
import './plugins/vuetify'
import firebase from 'firebase/app'
import App from '@/App.vue'
import router from '@/router'

Vue.config.productionTip = false

// Initialize Firebase
const config = {
  apiKey: "AIzaSyAijnAIQx2rKxbfHtEsCCRQ0z9P_40m748",
  authDomain: "shared-duties.firebaseapp.com",
  databaseURL: "https://shared-duties.firebaseio.com",
  projectId: "shared-duties",
  storageBucket: "shared-duties.appspot.com",
  messagingSenderId: "860045022152"
}
firebase.initializeApp(config)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
