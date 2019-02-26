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
        <span class="mr-1" v-if="!editMode">Add</span> <span v-else>Edit</span>Task
      </v-card-title>

      <v-container grid-list-sm>
        <v-card-text>
          <v-text-field
            :error-messages="vErrors('name')"
            v-model="name"
            name="name"
            label="Task name"
            prepend-icon="assignment"
          ></v-text-field>
          <v-textarea
            v-model="description"
            name="description"
            label="Description"
            prepend-icon="description"
            multi-line
            rows="3"
          ></v-textarea>
          <DatePicker
            ref="datePicker"
            v-model="date"
            class="mb-3"
          />
          <v-select
            :items="assignSelect"
            v-model="assignedToMember"
            label="Assign to"
            prepend-icon="account_box"
          ></v-select>
          <v-subheader class="px-0"><v-icon class="mr-2">offline_bolt</v-icon>Task complexity</v-subheader>
          <v-rating
            v-model="ratingData.rating"
            full-icon="offline_bolt"
            empty-icon="offline_bolt"
            :hover="ratingData.hover"
            :length="ratingData.length"
            background-color="grey lighten-1"
            color="amber darken-1"
            medium
          ></v-rating>
        </v-card-text>
      </v-container>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="closeDialog">Close</v-btn>
        <v-btn
          @click="confirmDialog()"
          color="primary"
          flat
        >
          <span class="mr-1" v-if="!editMode">Add</span> <span v-else>Edit</span>Task
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Prop, Component, Watch, Vue } from 'vue-property-decorator'
import { required } from 'vuelidate/lib/validators'
import FirebaseService from '@/services/firebase'
import DatePicker from '@/components/DatePicker'

@Component({
  name: 'DialogTask',
  components: {
    DatePicker
  },
  validations: {
    name: {
      required
    }
  }
})
/**
 * Dialog Task Component
 */
export default class DialogTask extends Vue {
  @Prop(Boolean) editMode
  @Prop(Object) groupData
  @Prop({ default: false }) value

  name = ''
  description = ''
  date = ''
  members = []
  assignSelect = []
  assignedToMember = ''
  userData = false
  showDialog = false
  ratingData = {
    hover: true,
    length: 5,
    rating: 0
  }

  /**
   * Close dialog, triggering v-model event
   */
  closeDialog () {
    this.showDialog = false
    this.$emit('input', this.showDialog)
    this.$v.$reset()
  }

  /**
   * Get members data
   */
  getMembersData () {
    let members = []
    this.groupData.members.map(uid => {
      FirebaseService.searchByValueRef('/users', 'uid', uid).on('value', snapshot => {
        let response = snapshot.val()
        members.push(this.avoidIdObjectName(response))
      })
    })
    this.members = members
    console.log(JSON.parse(JSON.stringify(members)));
    members.map(member => this.assignSelect.push(member.username))
  }

  findUid (username) {
    let uid = ''
    this.members.find(el => {
      if (el.username === username) {
        uid = el.uid
      }
    })
    return uid
  }

  /**
   * Confirm dialog
   * @return {Promise}
   */
  confirmDialog () {
    this.$v.$touch()
    if (this.$v.$invalid) {
      return
    }
    const taskId = `task-${this.generateRandomId()}`
    let data = {
      taskId: taskId,
      name: this.name,
      rating: this.ratingData.rating,
      date: this.date ? this.date : '',
      groupId: this.groupData.groupId,
      description: this.description,
      owner: this.findUid(this.assignedToMember),
      review: {
        up: 0,
        down: 0
      }
    }

    FirebaseService.createTask(taskId, data)
      .then(() => {
        this.addTaskIdToGroupData(this.groupData.groupId, taskId)
        if (data.owner !== '') {
          this.addTaskIdToUserData(data.owner, taskId)
        }
        this.$refs.datePicker.resetData()
        this.flash('Task succesfully added', 'success')
      })
      .catch(err => {
        this.flash(err.message, 'success')
        this.$refs.datePicker.resetData()
      })
  }

  addTaskIdToUserData (uid, taskId) {
    let data = this.members.find(member => member.uid === uid)
    console.log(data)
    if (!data.tasks) {
      data['tasks'] = []
      data['tasks'].push(taskId)
    } else {
      data['tasks'].push(taskId)
    }
    FirebaseService.updateUser(uid, data)
  }

  /**
   * Add task to group (to tasks property)
   * @param  {String} groupId
   * @return {Promise}
   */
  addTaskIdToGroupData (groupId, taskId) {
    let data = this.groupData
    if (!data.tasks) {
      data['tasks'] = []
      data['tasks'].push(taskId)
    } else {
      data['tasks'].push(taskId)
    }
    return FirebaseService.updateGroup(groupId, data)
      .then(() => {
        this.closeDialog()
      })
      .catch(err => {
        this.flash(err.message, 'error')
      })
  }

  /**
   * Watcher for value
   */
  @Watch('value')
  initData () {
    this.getMembersData()
    this.assignedToMember = ''
    this.showDialog = this.value
    this.name = ''
    this.description = ''
    this.date = ''
    this.ratingData = {
      hover: true,
      length: 5,
      rating: 0
    }
  }
}
</script>

<style lang="stylus" scoped>
.complexity-text {
  color: grey
}
</style>
