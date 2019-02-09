<template>
  <v-app id="app">
    <v-toolbar app absolute flat dark color="black">
      <v-toolbar-title v-if="userSignedIn" class="toolbar-title toolbar-title-access" @click="$router.replace('/dashboard')"><v-icon class="mr-2">dashboard</v-icon>Dashboard</v-toolbar-title>
      <v-toolbar-title v-else class="toolbar-title">Shared Duties</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="userSignedIn">
        <v-menu offset-y>
          <v-icon large slot="activator" fab color="white">account_circle</v-icon>
          <v-list>
            <v-list-tile>
              <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
      <div class="ml-3">
      <v-btn v-if="userSignedIn" color="error" dark @click="signOut">sign out</v-btn>
      </div>
    </v-toolbar>
    <FlashMessage />
    <router-view class="mt-5 pt-5"/>
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { mapActions } from 'vuex'
import FirebaseService from '@/services/firebase'
import FlashMessage from '@/components/FlashMessage'

@Component({
  name: 'App',
  components: {
    FlashMessage
  },
  methods: mapActions(['setUserEmail'])
})
/**
 * App Page
 */
export default class App extends Vue {
  userSignedIn = false
  /**
   * On component creation
   */
  created () {
    /**
     * Auth observer checks if user is signed in, otherwise it will redirect to Home Page
     */
    FirebaseService.authRequest().onAuthStateChanged(user => {
      if (!user) {
        this.userSignedIn = false
      } else {
        this.userSignedIn = true
      }
    })
  }

  /**
   * Sign out
   * @return {Promise}
   */
  signOut () {
    FirebaseService.signOut()
      .then(() => {
        this.userSignedIn = false
        this.flash('Succesfully signed out', 'info')
      })
      .catch(err => {
        this.flash(err.message, 'error')
      })
  }
}
</script>

<style lang="stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background-image: url('./assets/bg.png');
  background-repeat: no-repeat;
  background-position: contain;
  background-size: 100vw;
  background-attachment: fixed
}
.toolbar-title {
  cursor: pointer;
}
.toolbar-title-access:hover {
  color: #EF5350;
}
</style>
