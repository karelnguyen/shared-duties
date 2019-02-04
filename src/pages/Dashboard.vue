<template>
  <v-container grid-list-md>

    <v-tabs class="mt-5" dark left color="black" slider-color="red" slot="extension" v-model="tab">
      <v-tab
        v-for="tabs in ['overview', 'calendar']"
        :key="tabs"
        :href="`#tab-${tabs}`"
      >
        {{ tabs }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        value="tab-overview"
        class="mt-1"
      >
        <v-layout row wrap justify-space-between>
          <v-flex xs12 lg8>
            <v-card tile min-height="200">
                <v-layout row wrap>
                  <v-flex>
                    <v-card-title
                      class="headline lighten-2"
                      primary-title
                      >
                      Groups
                      <v-spacer></v-spacer>
                      <v-icon>all_inbox</v-icon>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-progress-circular
                        v-if="groupsLoading"
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                      <v-flex xs7  class="text-sm-left" v-else>
                        <div class="font-weight-bold subheading">
                          Groups that I own:
                        </div>
                        <span v-for="(oGroups, key) in ownGroups" :key="key">
                          <v-btn color="primary" class="ml-2" @click="$router.push({ name: 'groupDetail', params: { groupName: 'neco' } })">
                            {{oGroups.name}}
                          </v-btn>
                        </span>
                        <div class="font-weight-bold subheading">
                          Groups that I am a member of:
                        </div>
                        <div v-for="(fGroups, key) in foreignGroups" :key="key">
                          <div class="ml-2">
                            {{fGroups.name}}
                          </div>
                        </div>
                      </v-flex>
                    </v-card-text>
                    <v-spacer></v-spacer>
                    <v-divider></v-divider>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="black" dark @click="showDialog = true">Add group</v-btn>
                  </v-card-actions>
                  <DialogGroup
                    v-model="showDialog"
                    :editMode="false"
                  />
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>

          <v-flex xs12 lg4>
            <v-card tile min-width="300">
              <v-layout row wrap>
                <v-flex>
                  <v-card-title
                  class="headline lighten-2"
                  primary-title
                  >
                  User
                  <v-spacer></v-spacer>
                  <v-icon>supervisor_account</v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-layout row wrap v-if="!isObjectEmpty(userData)">
                    <v-flex xs6 class="text-sm-left">
                      <div class="subheading">
                        first name:
                      </div>
                      <div class="subheading">
                        last name:
                      </div>
                      <div class="subheading">
                        username:
                      </div>
                      <div class="subheading">
                        email:
                      </div>
                    </v-flex>
                    <v-flex xs6 class="text-sm-left">
                      <div class="subheading font-weight-bold">
                        {{userData[uid].firstName}}
                      </div>
                      <div class="subheading font-weight-bold">
                        {{userData[uid].lastName}}
                      </div>
                      <div class="subheading font-weight-bold">
                        {{userData[uid].username}}
                      </div>
                      <div class="subheading font-weight-bold">
                        {{userData[uid].email}}
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
            </v-card>
          </v-flex>
        </v-layout>
      </v-tab-item>
      <v-tab-item
        value="tab-calendar"
      >
        <v-card flat>
          <v-card-text>neco 2</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
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
  uid = localStorage.getItem('uid')
  showDialog = false
  ownGroups = []
  foreignGroups = []
  groupsLoading = false
  userData = {}
  tab = 'tab-overview'

  /**
   * Mounted
   */
  mounted () {
    this.getGroups()
    this.getUserInfo()
  }

  /**
   * Get user information
   * @return {Promise}
   */
  getUserInfo () {
    return FirebaseService.searchByValueRef('/users', 'uid', this.uid).on('value', snapshot => {
      this.userData = snapshot.val()
    })
  }

  /**
   * Get all groups
   * @return {Promise}
   */
  getGroups () {
    this.groupsLoading = true
    return FirebaseService.firebaseRequest('groups').on('value', snapshot => {
      let uid = localStorage.getItem('uid')
      let response = snapshot.val()
      let OGData = []
      let FGData = []

      for (let group in response) {
        /**
        * Groups that user owns
        */
        if (uid === response[group].owner) {
          OGData.push(response[group])
        }

        /**
        * Groups that user is member of
        */
        if (response[group].members.includes(uid) && uid !== response[group].owner) {
          FGData.push(response[group])
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
</style>
