<template>
  <v-dialog
    v-model="value"
    width="500"
    persistent
  >
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        <span class="mr-1" v-if="!editMode">Add</span> <span v-else>Edit</span>member
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="formData.search"
          name="search"
          label="Search username"
          prepend-icon="search"
          @input="searchUser(formData.search)"
        ></v-text-field>
        <div v-if="!isObjectEmpty(searchedUser)">
          <v-layout row wrap class="text-sm-left" align-center align-content-center>
            <v-icon class="mr-3">assignment_ind</v-icon>
            <v-flex>
              {{searchedUser.username}}
            </v-flex>
            <v-flex>
              {{`${searchedUser.firstName} ${searchedUser.lastName}`}}
            </v-flex>
            <v-flex>
              {{searchedUser.email}}
            </v-flex>
            <v-btn v-if="!forbiddenUser" flat color="green" dark small @click="addUserIdToGroupData()"><v-icon>check</v-icon>add</v-btn>
          </v-layout>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Prop, Emit, Component, Watch, Vue } from 'vue-property-decorator'
import FirebaseService from '@/services/firebase'

@Component({
  name: 'DialogMember'
})
/**
 * Dialog Group Component
 */
export default class DialogMember extends Vue {
  @Prop(Boolean) editMode
  @Prop(Array) members
  @Prop(String) groupId
  @Prop({ default: false }) value

  searchedUser = {}
  formData = {
    search: ''
  }
  showDialog = false
  forbiddenUser = false

  /**
   * Close dialog, triggering v-model event
   */
  closeDialog () {
    this.showDialog = false
    this.$emit('input', this.showDialog)
  }

  /**
   * Search user by username
   * @param  {String} value
   * @return {Promise}
   */
  searchUser (value) {
    this.forbiddenUser = false
    return FirebaseService.searchByValueRef('/users', 'username', value).on('value', snapshot => {
      let response = snapshot.val()
      if (response) {
        this.searchedUser = this.avoidIdObjectName(response)
        if (this.members.includes(this.searchedUser.uid)) {
          this.forbiddenUser = true
        }
      } else {
        this.searchedUser = {}
      }
    })
  }

  /**
   * Add user to group (to members property)
   */
  @Emit('refresh')
  addUserIdToGroupData () {
    let newMembers = this.members
    newMembers.push(this.searchedUser.uid)
    let data = {
      members: newMembers
    }
    return FirebaseService.updateGroup(this.groupId, data)
      .then(() => {
        this.addGroupIdToUserData(this.groupId, this.searchedUser.uid)
        this.closeDialog()
        this.flash('Added new member to group', 'success')
      })
      .catch(err => {
        this.flash(err.message, 'error')
      })
  }

  /**
   * Add groupId to user data
   * @param {String} groupId
   * @param {String} uid
   */
  addGroupIdToUserData (groupId, uid) {
    let data = this.searchedUser
    if (!data.groups) {
      data['groups'] = []
      data.groups.push(groupId)
    } else {
      data.groups.push(groupId)
    }
    return FirebaseService.updateUser(uid, data)
  }

  /**
   * Watcher for value
   */
  @Watch('value')
  initData () {
    this.showDialog = this.value
    this.searchedUser = {}
    this.formData = {
      search: ''
    }
    this.forbiddenUser = false
  }
}
</script>

<style lang="stylus" scoped>
</style>
