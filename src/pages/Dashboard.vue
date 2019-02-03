<template>
  <v-container>

    <v-toolbar app absolute flat color="white">
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
      <v-btn color="black" dark @click="signOut">sign out</v-btn>
    </v-toolbar>

    <v-layout row wrap justify-space-around class="mt-5">
      <v-flex xs6>
        <v-card flat min-height="200">
          <v-layout row wrap align-content-center align-center justify-center>
            <v-card-text
              class="mt-3"
              v-if="groupsLoading"
            >
              <v-progress-circular
              class="mt-5"
              indeterminate
              color="primary"
              ></v-progress-circular>
            </v-card-text>
          <v-flex v-else>
            <v-card-title
            class="headline lighten-2"
            primary-title
            >
            Groups
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div>
              Groups that I own:
            </div>
            <div v-for="(oGroups, key) in ownGroups" :key="key">
              <div>
                {{oGroups.name}}
              </div>
            </div>
            <div>
              Groups that I am a member of:
            </div>
            <div v-for="(fGroups, key) in foreignGroups" :key="key">
              <div>
                {{fGroups.name}}
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="mt-5" color="primary" @click="showDialog = true">Add group</v-btn>
          </v-card-actions>
          <DialogGroup
            v-model="showDialog"
            :editMode="false"
          />
        </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs5>
        <v-card flat>
          <v-card-title
            class="headline lighten-2"
            primary-title
          >
            Profile
          </v-card-title>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
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
  ownGroups = []
  foreignGroups = []
  groupsLoading = false
  /**
   * Sign out
   */
  signOut () {
    FirebaseService.signOut()
  }

  /**
   * Mounted
   */
  mounted () {
    this.getGroups()
  }

  /**
   * Get all groups
   * @return {Promise}
   */
  getGroups () {
    this.groupsLoading = true
    return FirebaseService.groupsRef().on('value', snapshot => {
      let uid = localStorage.getItem('uid')
      let data = snapshot.val()
      let OGData = []
      let FGData = []

      for (let group in data) {
        /**
        * Groups that user owns
        */
        if (uid === data[group].owner) {
          OGData.push(data[group])
        }

        /**
        * Groups that user is member of
        */
        if (data[group].members.includes(uid) && uid !== data[group].owner) {
          FGData.push(data[group])
        }
      }
      
      this.ownGroups = OGData
      this.foreignGroups = FGData
      this.groupsLoading = false
    })
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
