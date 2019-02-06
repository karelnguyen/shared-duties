<template>
  <v-container>
    <v-layout row wrap justify-space-between>
      <v-flex xs12>
        <v-card tile min-height="200">
            <v-layout row wrap>
              <v-flex>
                <v-card-title
                  class="headline lighten-2"
                  primary-title
                  >
                  Group <span class="ml-1" v-if="!isObjectEmpty(groupData)">{{ groupData.name }}</span>
                  <v-spacer></v-spacer>
                  <v-icon>all_inbox</v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text v-if="loading">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-card-text>
                <v-card-text v-else>
                  <v-layout row wrap v-if="!isObjectEmpty(ownerData)">
                    <v-flex xs2 class="text-sm-left subheading">
                      <div>
                        owner:
                      </div>
                      <div>
                        members:
                      </div>
                      <div>
                        tasks:
                      </div>
                    </v-flex>
                    <v-flex xs6 class="text-sm-left">
                      <div class="subheading font-weight-bold">
                        {{ownerData.username}}
                      </div>
                      <span
                        class="mr-2 subheading font-weight-bold"
                        v-for="member in membersData"
                        :key="member.uid">
                        <span>{{member.username}}</span>
                      </span>
                    </v-flex>
                  </v-layout>
                </v-card-text>
                <v-spacer></v-spacer>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn color="black" @click="dialogs.showTaskDialog = true" dark >Add task</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn :disabled="!isOwner" color="black" @click="dialogs.showMemberDialog = true" dark >Add member</v-btn>
                </v-card-actions>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <DialogMember
      v-model="dialogs.showMemberDialog"
      :editMode="false"
      :groupId="groupData.groupId"
      :members="groupData.members"
      @refresh="getGroupData(currentGroupId)"
    />
    <DialogTask
      v-model="dialogs.showTaskDialog"
      :editMode="false"
      :groupId="groupData.groupId"
    />
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import FirebaseService from '@/services/firebase'
import DialogMember from '@/components/DialogMember'
import DialogTask from '@/components/DialogTask'
import _ from 'lodash'

@Component({
  name: 'GroupDetail',
  components: {
    DialogMember,
    DialogTask
  }
})
/**
 * Group Detail Page
 */
export default class GroupDetail extends Vue {
  currentGroupId = localStorage.getItem('currentGroupId')
  membersData = []
  ownerData = {}
  groupData = {}
  loading = true
  isOwner = false
  dialogs = {
    showMemberDialog: false,
    showTaskDialog: false
  }

  /**
   * Get group detail data
   * @return {Promise}
   */
  getGroupData (groupId) {
    this.loading = true
    this.groupData = {}
    return FirebaseService.searchByValueRef('/groups', 'groupId', groupId).on('value', snapshot => {
      let response = snapshot.val()
      if (response) {
        this.groupData = this.avoidIdObjectName(response)
        this.groupData.members.map(memberId => {
          this.getUserData(memberId)
        })
        this.getGroupOwnerData(this.groupData.owner)
      }
    })
  }

  /**
   * Get user data
   * @param  {String} uid
   * @return {Promise}
   */
  getUserData (uid) {
    let data = this.membersData
    return FirebaseService.searchByValueRef('/users', 'uid', uid).on('value', snapshot => {
      let response = snapshot.val()
      if (response) {
        response = this.avoidIdObjectName(response)
        let duplicateKey = _.find(data, { 'uid': uid })
        if (!duplicateKey) {
          data.push(response)
          this.membersData = data
        }
      }
    })
  }

  /**
   * Get user information
   * @param  {String} uid
   * @return {Promise}
   */
  getGroupOwnerData (uid) {
    this.isOwner = false
    return FirebaseService.searchByValueRef('/users', 'uid', uid).on('value', snapshot => {
      let response = snapshot.val()
      this.ownerData = this.avoidIdObjectName(response)
      this.loading = false
      if (this.ownerData.uid === localStorage.getItem('uid')) {
        this.isOwner = true
      }
    })
  }

  /**
   * Data initialization
   */
  initData () {
    this.loading = true
    this.membersData = []
    this.ownerData = {}
    this.groupData = {}
    this.dialogs.showMemberDialog = false
    if (this.$route.params.groupId) {
      this.getGroupData(this.$route.params.groupId)
    } else {
      this.getGroupData(this.currentGroupId)
    }
  }

  /**
   * Mounted
   */
  mounted () {
    this.initData()
  }
}
</script>

<style lang="stylus" scoped>

</style>
