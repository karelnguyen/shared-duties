<template>
  <v-container>

    <v-toolbar app absolute>
      <v-toolbar-title>Shared Duties</v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="nav-email">{{userEmailFromLocalStorage}}</span>
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
      <v-btn color="error" @click="signOut">sign out</v-btn>
    </v-toolbar>

    <v-layout row wrap>
      <v-btn class="mt-5" color="primary" @click="showDialog = true">Add group</v-btn>
      <DialogGroup
        v-model="showDialog"
        :editMode="false"
      />
    </v-layout>
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import FirebaseService from '@/services/firebase'
import DialogGroup from '@/components/DialogGroup'

@Component({
  name: 'Dashboard',
  components: {
    DialogGroup
  }
})
/**
 * Dashboard Page
 */
export default class Dashboard extends Vue {
  userEmailFromLocalStorage = localStorage.getItem('userEmail')
  showDialog = false
  /**
   * Sign out
   */
  signOut () {
    FirebaseService.signOut()
  }
}

</script>

<style lang="stylus" scoped>
  .nav-profile-section {
    height: 50px
  }
  .nav-email {
    margin: 10px
  }
</style>
