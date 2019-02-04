<template>
  <v-app id="app">
    <v-toolbar app absolute flat color="white">
      <!-- <v-toolbar-title>Shared Duties Dashboard</v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu offset-y>
          <v-icon large slot="activator" fab color="black">account_circle</v-icon>
          <v-list>
            <v-list-tile>
              <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
      <v-btn color="black" dark @click="signOut">sign out</v-btn>
    </v-toolbar>
    <router-view />
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { mapActions } from 'vuex'
import FirebaseService from '@/services/firebase'

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
      Auth observer checks if user is signed in, otherwise it will redirect to Home Page
     */
    FirebaseService.authRequest().onAuthStateChanged(user => {
      if (!user) {
        this.$router.replace({ name: 'home' })
      } else {
        this.setUserEmail(user.email)
        localStorage.setItem('userEmail', user.email)
        localStorage.setItem('uid', user.uid)
      }
    })
  }

  /**
   * Sign out
   */
  signOut () {
    FirebaseService.signOut()
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
  background: #141E30;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #243B55, #141E30);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #243B55, #141E30); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
