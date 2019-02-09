<template>
  <v-container>
    <v-layout row wrap justify-space-between>
      <v-flex xs12>
        <v-card tile min-height="200">
          <v-card-title
            class="headline lighten-2"
            primary-title
            >
            <span class="ml-1" v-if="!isObjectEmpty(groupData)">{{ groupData.name }}</span>
            <v-spacer></v-spacer>
            <v-icon>all_inbox</v-icon>
          </v-card-title>
          <v-divider></v-divider>
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
            class="mt-5 mb-5"
          ></v-progress-circular>
          <v-layout row wrap v-else>
            <v-flex v-if="!tasksData.length">
              <v-layout class="no-data-tasks" row wrap align-center justify-center>
                <v-card-text>
                    <span class="display-3">no tasks</span>
                </v-card-text>
              </v-layout>
            </v-flex>
            <v-flex xs9 v-else>
              <v-card-text>
                <v-layout column wrap>
                  <v-layout row wrap align-center class="mb-3">
                    <v-icon class="mr-3">assignment</v-icon>
                    <span class="headline font-weight-bold">Tasks</span>
                  </v-layout>
                  <v-container grid-list-md>
                    <v-layout row wrap justify-start>
                      <v-flex xs4 v-for="task in tasksData" :key="task.taskId">
                        <v-card>
                          <v-card-title class="subheading font-weight-bold grey lighten-2">
                            <span>{{task.name}}</span>
                          </v-card-title>
                          <v-divider></v-divider>
                          <v-card-text class="text-sm-left mt-2">
                            <v-layout row wrap align-center class="mb-2">
                              <v-icon class="mr-3">description</v-icon>{{task.description}}
                            </v-layout>
                            <v-layout row wrap align-center class="mb-2">
                              <v-icon class="mr-3">offline_bolt</v-icon>{{task.rating}}
                            </v-layout>
                            <v-layout row wrap align-center class="mb-2" v-if="task.date">
                              <v-icon class="mr-3">event</v-icon>{{task.date}}
                            </v-layout>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-layout>
              </v-card-text>
            </v-flex>
            <v-flex xs3>
              <v-card-text>
                <v-layout row wrap align-center class="mb-4">
                  <v-icon class="mr-3">info</v-icon>
                  <span class="headline font-weight-bold">Group Info</span>
                </v-layout>
                <v-layout row wrap v-if="!isObjectEmpty(ownerData)" class="group-info">
                  <v-flex xs4 class="text-sm-left subheading font-weight-bold ml-4">
                    <v-layout row wrap align-center>
                      <v-icon class="mr-3">folder_shared</v-icon>
                      name:
                    </v-layout>
                    <v-divider></v-divider>
                    <v-layout row wrap align-center>
                      <v-icon class="mr-3">account_box</v-icon>
                      owner:
                    </v-layout>
                    <v-divider></v-divider>
                    <v-layout row wrap align-center>
                      <v-icon class="mr-3">people</v-icon>
                      members:
                    </v-layout>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs6 class="text-sm-left">
                    <div class="subheading font-weight-bold  text-truncate">
                      {{groupData.name}}
                    </div>
                    <v-divider></v-divider>
                    <div class="subheading font-weight-bold">
                      {{ownerData.username}}
                    </div>
                    <div>
                      <div
                        class="subheading font-weight-bold"
                        v-for="member in membersData"
                        :key="member.uid">
                        <span v-if="member.username !== ownerData.username">{{member.username}}</span>
                        <v-divider></v-divider>
                      </div>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
          </v-flex>
          </v-layout>
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="black" @click="dialogs.showTaskDialog = true" dark >Add task</v-btn>
            <v-spacer></v-spacer>
            <v-btn :disabled="!isOwner" color="black" @click="dialogs.showMemberDialog = true" dark >Add member</v-btn>
          </v-card-actions>
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
      :groupData="groupData"
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
  tasksData = []
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
        this.getGroupOwnerData(this.groupData.owner)
        this.groupData.members.map(memberId => {
          this.getUserData(memberId)
        })
        if (this.groupData.tasks) {
          this.groupData.tasks.map(taskId => {
            this.getTaskData(taskId)
          })
        }
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
   * Get task data
   * @param  {String} taskId
   * @return {Promise}
   */
  getTaskData (taskId) {
    let data = this.tasksData
    return FirebaseService.searchByValueRef('/tasks', 'taskId', taskId).on('value', snapshot => {
      let response = snapshot.val()
      response = this.avoidIdObjectName(response)
      let duplicateKey = _.find(data, { 'taskId': taskId })
      if (!duplicateKey) {
        data.push(response)
        this.tasksData = data
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
.group-info {
  line-height: 2.5
}
.no-data-tasks {
  color: #BDBDBD
  height: 100%
}
</style>
