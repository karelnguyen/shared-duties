<template>
  <v-container grid-list-sm>
    <v-tabs class="pb-1" dark left color="black" slider-color="red" v-model="tab">
      <v-tab
        v-for="tabs in ['overview', 'calendar']"
        :key="tabs"
        :href="`#tab-${tabs}`"
        >
        <v-icon class="mr-2" v-if="tabs === 'calendar'">event</v-icon>
        <v-icon class="mr-2" v-else>store</v-icon>
        {{ tabs }}
      </v-tab>
    </v-tabs>

    <v-card flat>
      <v-tabs-items v-model="tab">
        <v-tab-item
          value="tab-overview"
        >
          <v-layout>
            <v-flex xs12 lg8>
                <v-layout row wrap>
                  <v-flex>
                    <v-card-title
                      class="headline lighten-2"
                      primary-title
                      >
                      <v-icon class="mr-4">folder_shared</v-icon>
                      Groups
                      <v-spacer></v-spacer>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-progress-circular
                        v-if="groupsLoading"
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                      <v-flex  class="text-sm-left" v-else>
                        <div class="font-weight-bold title mb-3">
                          My groups
                        </div>
                        <v-container grid-list-md>
                          <v-layout row wrap>
                            <v-flex xs3 v-for="oGroups in ownGroups" :key="oGroups.groupId">
                              <v-card class="group-card" hover @click="redirectToGroupDetail(oGroups.groupId, oGroups.name)">
                                <v-card-title
                                  class="subheading black lighten-4"
                                >
                                  <v-layout row wrap justify-space-between>
                                    <v-flex xs9 class="text-truncate group-title own-card-title">
                                      <span>{{oGroups.name}}</span>
                                    </v-flex>
                                    <v-icon dark>folder_shared</v-icon>
                                  </v-layout>
                                </v-card-title>
                                <v-card-text>
                                  {{oGroups.name}}
                                </v-card-text>
                              </v-card>
                            </v-flex>
                          </v-layout>
                        </v-container>
                        <v-divider class="mt-4 mb-4"></v-divider>
                        <div class="font-weight-bold title mb-3">
                          I am a member of
                        </div>
                        <v-container grid-list-md>
                          <v-layout row wrap>
                            <v-flex xs3 v-for="fGroups in foreignGroups" :key="fGroups.groupId">
                              <v-card class="group-card" hover @click="redirectToGroupDetail(fGroups.groupId, fGroups.name)">
                                <v-card-title
                                  class="subheading black lighten-2 card-title"
                                >
                                  <v-layout row wrap justify-space-between>
                                    <v-flex xs9 class="text-truncate group-title foreign-group-title">
                                      <span>{{fGroups.name}}</span>
                                    </v-flex>
                                    <v-icon dark>folder_shared</v-icon>
                                  </v-layout>
                                </v-card-title>
                                <v-card-text>
                                  {{fGroups.name}}
                                </v-card-text>
                              </v-card>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-flex>
                    </v-card-text>

                  <DialogGroup
                    v-model="showDialog"
                    :editMode="false"
                  />
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12 lg4>
              <v-layout row wrap>
                <v-flex>
                  <v-card-title
                  class="headline lighten-2"
                  primary-title
                  >
                  <v-icon class="mr-4">contacts</v-icon>
                  User
                  <v-spacer></v-spacer>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-layout column wrap v-if="!isObjectEmpty(userData)">
                    <v-icon style="font-size: 120px" class="mt-5 mb-5">account_circle</v-icon>
                    <v-flex xs6 class="text-sm-center">
                      <div class="subheading font-weight-bold">
                        {{`${userData.firstName} ${userData.lastName}`}}
                      </div>
                      <div class="subheading font-weight-bold">
                      </div>
                      <div class="subheading font-weight-bold">
                        {{userData.username}}
                      </div>
                      <div class="subheading font-weight-bold">
                        {{userData.email}}
                      </div>
                    </v-flex>
                  </v-layout>
                  <v-progress-circular
                  v-else
                  indeterminate
                  color="primary"
                  ></v-progress-circular>
                </v-card-text>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout row wrap justify-space-between>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="black" dark @click="showDialog = true">Add group</v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="black" dark >Edit profile</v-btn>
            </v-card-actions>
          </v-layout>
        </v-tab-item>

        <v-tab-item
          value="tab-calendar"
        >
          <v-card flat>
            <Calendar/>
          </v-card>
        </v-tab-item>

      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import FirebaseService from '@/services/firebase'
import DialogGroup from '@/components/DialogGroup'
import Calendar from '@/components/Calendar'
import { mapActions, mapState } from 'vuex'

@Component({
  name: 'Dashboard',
  components: {
    DialogGroup, Calendar
  },
  methods: mapActions(['setUserEmail', 'setOwnGroups', 'setForeignGroups']),
  computed: mapState({
    ownGroups: state => state.user.ownGroups,
    foreignGroups: state => state.user.foreignGroups
  })
})
/**
 * Dashboard Page
 */
export default class Dashboard extends Vue {
  uid = localStorage.getItem('uid')
  showDialog = false
  groupsLoading = false
  userData = {}
  tab = 'tab-overview'

  /**
   * Mounted
   */
  mounted () {
    this.getGroups()
    this.getUserInfo(this.uid)
  }

  /**
   * Get user information
   * @return {Promise}
   */
  getUserInfo (uid) {
    return FirebaseService.searchByValueRef('/users', 'uid', uid).on('value', snapshot => {
      this.userData = this.avoidIdObjectName(snapshot.val())
    })
  }

  /**
   * Get all groups
   * @return {Promise}
   */
  getGroups () {
    this.groupsLoading = true
    FirebaseService.firebaseRequest('groups').on('value', snapshot => {
      let uid = localStorage.getItem('uid')
      let response = snapshot.val()
      let oGData = []
      let fGData = []

      for (let group in response) {
        /**
        * Groups that user owns
        */
        if (uid === response[group].owner) {
          oGData.push(response[group])
        }

        /**
        * Groups that user is member of
        */
        if (response[group].members.includes(uid) && uid !== response[group].owner) {
          fGData.push(response[group])
        }
      }
      /**
       * Save data to store (ownGroups, foreignGroups)
       */
      this.setOwnGroups(oGData)
      this.setForeignGroups(fGData)
      this.groupsLoading = false
    })
  }

  /**
   * Redirect to group detail page
   * @param  {String} groupId
   * @param  {String} groupName
   */
  redirectToGroupDetail (groupId, groupName) {
    localStorage.setItem('currentGroupId', groupId)
    groupName = groupName.indexOf(' ') > -1 ? this.replaceSpaceWithDash(groupName) : groupName.toLowerCase()
    this.$router.push({ name: 'groupDetail', params: { groupName: groupName, groupId: groupId } })
  }
}

</script>

<style lang="stylus" scoped>
  .nav-profile-section {
    height: 50px
  }
  /* .group-card {
    cursor: pointer
  }
  .group-card:hover {
    box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)
  } */
  .group-title {
    color: white
  }
  .own-card-title {
    border-bottom: 2px solid #EF5350
  }
  .foreign-group-title {
    border-bottom: 2px solid #1E88E5
  }
</style>
