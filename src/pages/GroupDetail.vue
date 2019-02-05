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
                <v-card-text>
                  <v-layout row wrap v-if="!isObjectEmpty(ownerData)">
                    <v-flex xs2 class="text-sm-left">
                      <div class="subheading">
                        owner:
                      </div>
                      <div class="subheading">
                        members:
                      </div>
                      <div class="subheading">
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
                        <span>{{avoidIdObjectName(member).username}}</span>
                      </span>
                    </v-flex>
                  </v-layout>
                  <v-progress-circular
                    v-else
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-card-text>
                <v-spacer></v-spacer>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn color="black" dark >Add task</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="black" @click="showDialog = true" dark >Add member</v-btn>
                </v-card-actions>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <DialogMember
      v-model="showDialog"
      :editMode="false"
      :groupId="groupData.groupId"
      :members="groupData.members"
      @refresh="initData()"
    />
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import FirebaseService from '@/services/firebase'
import DialogMember from '@/components/DialogMember'

@Component({
  name: 'GroupDetail',
  components: {
    DialogMember
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
  showDialog = false
  loading = false

  /**
   * Get group detail data
   * @return {Promise}
   */
  getGroupData (groupId) {
    return FirebaseService.searchByValueRef('/groups', 'groupId', groupId).on('value', snapshot => {
      let response = snapshot.val()
      this.groupData = this.avoidIdObjectName(response)
      this.groupData.members.map(memberId => {
        this.getUserData(memberId)
      })
      this.getGroupOwnerData(this.groupData.owner)
    })
  }

  getUserData (uid) {
    return FirebaseService.searchByValueRef('/users', 'uid', uid).on('value', snapshot => {
      let response = snapshot.val()
      this.membersData.push(response)
    })
  }

  /**
   * Get user information
   * @param  {String} uid
   * @return {Promise}
   */
  getGroupOwnerData (uid) {
    return FirebaseService.searchByValueRef('/users', 'uid', uid).on('value', snapshot => {
      let response = snapshot.val()
      this.ownerData = this.avoidIdObjectName(response)
    })
  }

  /**
   * Data initialization
   */
  initData () {
    this.membersData = []
    this.ownerData = {}
    this.groupData = {}
    this.showDialog = false
    this.loading = false
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
