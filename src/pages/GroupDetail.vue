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
            <v-flex xs12 xl3>
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
                    <v-layout row wrap align-content-center class="subheading font-weight-bold text-truncate">
                      <span>{{groupData.name}}</span>
                    </v-layout>
                    <v-divider></v-divider>
                    <div class="subheading font-weight-bold">
                      <span class="mr-4">{{ownerData.username}}</span>
                      <span :style="`color: ${groupData.colors[ownerData.uid]}`">&#11044;</span>
                    </div>
                    <div>
                      <div
                      class="subheading font-weight-bold"
                      v-for="member in membersData"
                      :key="member.uid">
                      <span v-if="member.username !== ownerData.username">
                        <span class="mr-4">{{member.username}}</span>
                        <span :style="`color: ${groupData.colors[member.uid]}`">&#11044;</span>
                      </span>
                      <v-divider></v-divider>
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-card-text>
            </v-flex>
            <v-flex v-if="!tasksData.length">
              <v-layout class="no-data-tasks" row wrap align-center justify-center>
                <v-card-text>
                    <span class="display-3">no tasks</span>
                </v-card-text>
              </v-layout>
            </v-flex>
            <v-flex xs12 xl9 v-else>
              <v-card-text>
                <v-layout column wrap>
                  <v-layout row wrap align-center class="mb-3">
                    <v-icon class="mr-3">assignment</v-icon>
                    <span class="headline font-weight-bold">Tasks</span>
                  </v-layout>
                  <v-container grid-list-md>
                    <v-layout row wrap justify-start>
                      <v-flex xs12 md6 lg4 v-for="task in tasksData" :key="task.taskId">
                        <v-card>
                          <v-card-title class="subheading font-weight-bold grey lighten-2">
                            <span>{{task.name}}</span>
                          </v-card-title>
                          <v-divider></v-divider>
                          <v-card-text class="text-sm-left mt-2 font-weight-bold">
                            <v-layout row wrap align-center class="mb-2">
                              <div class="text-truncate">
                                <v-icon class="mr-3">description</v-icon>{{task.description}}
                              </div>
                            </v-layout>
                            <v-layout row wrap align-center class="mb-2">
                              <v-icon class="mr-3">offline_bolt</v-icon>{{task.rating}}
                            </v-layout>
                            <v-layout row wrap align-center class="mb-2" v-if="task.date">
                              <v-icon class="mr-3">event</v-icon>{{task.date | formatDate}}
                            </v-layout>
                            <v-layout row wrap align-center class="mb-2" v-if="task.owner">
                              <v-icon
                                :color="groupData.colors[task.owner]"
                                class="mr-3">account_box
                              </v-icon>
                              <span>{{task.ownerUsername}}</span>
                            </v-layout>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-container>
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

        <v-card class="mt-3">
          <v-card-title class="headline">
            Group Calendar
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <Calendar
              :groupData="groupData"
              :tasksData="tasksData"
              :findUsername="findUsername"
            />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <DialogMember
      v-model="dialogs.showMemberDialog"
      :editMode="false"
      :groupData="groupData"
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
import Calendar from '@/components/Calendar'
import _ from 'lodash'

@Component({
  name: 'GroupDetail',
  components: {
    DialogMember,
    DialogTask,
    Calendar
  }
})
/**
 * Group Detail Page
 */
export default class GroupDetail extends Vue {
  currentGroupId = localStorage.getItem('currentGroupId')
  currentUid = localStorage.getItem('uid')
  usersMapper = []
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
   * Find user name by uid in members data
   * @param  {String} uid
   * @return {String}
   */
  findUsername (uid) {
    let username = ''
    this.membersData.find(el => {
      if (el.uid === uid) {
        username = el.username
      }
    })
    return username
  }

  /**
   * Get user data
   * @param  {String} uid
   * @return {Promise}
   */
  getUserData (uid) {
    let data = this.membersData
    let userMap = this.usersMapper
    return FirebaseService.searchByValueRef('/users', 'uid', uid).on('value', snapshot => {
      let response = snapshot.val()
      if (response) {
        response = this.avoidIdObjectName(response)
        let duplicateKey = _.find(data, { 'uid': uid })
        if (!duplicateKey) {
          userMap.push(snapshot.val())
          data.push(response)
          this.usersMapper = userMap
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
      this.isCurrentUserAMember()
    })
  }

  /**
   * Get task data
   * @param  {String} taskId
   * @return {Promise}
   */
  getTaskData (taskId) {
    this.loading = true
    let data = this.tasksData
    return FirebaseService.searchByValueRef('/tasks', 'taskId', taskId).on('value', snapshot => {
      let response = snapshot.val()
      response = this.avoidIdObjectName(response)
      if (response.owner.length) {
        response['ownerUsername'] = this.findUsername(response.owner)
      }
      let duplicateKey = _.find(data, { 'taskId': taskId })
      if (!duplicateKey) {
        data.push(response)
        this.tasksData = data
      }
      this.loading = false
    })
  }

  /**
   * Checks if user is a member in the curret group, otherwise, redirect to dashboard
   */
  isCurrentUserAMember () {
    if (!this.groupData.members.includes(this.currentUid)) {
      this.$router.replace('/dashboard')
      this.flash('You are not a member in this group', 'warning')
    }
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
.dot {
  height: 20px
}
</style>
