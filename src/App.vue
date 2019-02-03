<template>
  <v-app id="app">
    <router-view />
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { mapActions } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'

@Component({
  name: 'App',
  methods: mapActions(['setUserEmail'])
})
/**
 * App Page
 */
export default class App extends Vue {
  /**
   * On component creation
   */
  created () {
    /*
      Auth observer checks, if user is signed in, otherwise it will redirect to Home Page
     */
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.$router.replace({ name: 'home' })
      } else {
        this.setUserEmail(user.email)
        localStorage.setItem('userEmail', user.email)
        localStorage.setItem('uid', user.uid)
      }
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #dadddf;
}
</style>
