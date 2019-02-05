<template>
  <v-app id="app">
    <v-toolbar app absolute flat color="white">
      <v-toolbar-title class="toolbar-title" @click="redirect">Shared Duties Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!forbiddenRoute">
        <v-menu offset-y>
          <v-icon large slot="activator" fab color="black">account_circle</v-icon>
          <v-list>
            <v-list-tile>
              <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
      <span v-if="forbiddenRoute">

      </span>
      <span v-else>
        <v-btn color="black" dark @click="signOut">sign out</v-btn>
      </span>
    </v-toolbar>
    <FlashMessage />
    <router-view class="mt-5"/>
  </v-app>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
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
  forbiddenRoute = null
  userSignedIn = false
  /**
   * On component creation
   */
  created () {
    this.isForbidden()
    /**
     * Auth observer checks if user is signed in, otherwise it will redirect to Home Page
     */
    FirebaseService.authRequest().onAuthStateChanged(user => {
      if (!user) {
        if (!this.forbiddenRoute) {
          window.location.pathname = '/home'
        }
        this.userSignedIn = false
        this.flash('You are not signed in', 'warning')
      } else {
        this.userSignedIn = true
        if (this.forbiddenRoute) {
          window.location.pathname = '/dashboard'
        }
        this.setUserEmail(user.email)
        localStorage.setItem('userEmail', user.email)
        localStorage.setItem('uid', user.uid)
        this.flash('Succesfully signed in', 'success')
      }
    })
  }

  /**
   * Sign out
   */
  signOut () {
    FirebaseService.signOut()
      .then(() => {
        this.userSignedIn = true
        this.flash('Succesfully signed out', 'info')
      })
      .catch(err => {
        this.flash(err.message, 'error')
      })
  }

  redirect () {
    if (this.userSignedIn) {
      this.$router.replace('/dashboard')
    } else {
      return
    }
  }

  /**
   * Watcher for $route.params, decides if the current route is forbidden
   */
  @Watch('$route.params')
  isForbidden () {
    if (this.$route.name === 'home' || this.$route.name === 'login' || this.$route.name === 'signup') {
      this.forbiddenRoute = true
    } else {
      this.forbiddenRoute = false
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background: #DA4453;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #89216B, #DA4453);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #89216B, #DA4453); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.toolbar-title {
  cursor: pointer;
}
</style>
