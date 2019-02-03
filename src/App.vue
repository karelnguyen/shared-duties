<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import firebase from 'firebase/app'
require('firebase/auth')

@Component({
  name: 'App'
})
/**
 * App Page
 */
export default class App extends Vue {
  mounted () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
      } else {
        // No user is signed in.
        this.$router.replace({ name: 'home' })
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
  margin-top: 60px;
}
</style>
