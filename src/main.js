import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import FirebaseService from '@/services/firebase'
import firebaseConfig from '@/../config/firebase'
import '@/plugins/vuetify'
import '@/mixins'

Vue.use(Vuelidate)
Vue.use(Vuex)

FirebaseService.initFirebaseApp(firebaseConfig)

Vue.config.productionTip = false

const eventHub = new Vue()
Vue.prototype.$eventHub = eventHub

Vue.prototype.flash = (message, type, timeout) => {
  Vue.prototype.$eventHub.$emit('flash', message, type, timeout)
}

/**
 * Check if route meta require auth access before each route change
 */
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.conditionalRoute)) {
    /**
     * Auth observer checks if user is signed in
     */
    FirebaseService.authRequest().onAuthStateChanged(user => {
      if (user) {
        localStorage.setItem('userEmail', user.email)
        localStorage.setItem('uid', user.uid)
        next()
      } else {
        next({ path: '/' })
      }
    })
  } else {
    next()
  }
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
