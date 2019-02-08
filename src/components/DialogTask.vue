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
          <v-text-field
            v-model="description"
            name="description"
            label="Description"
            prepend-icon="description"
          ></v-text-field>
          <DatePicker v-model="date" />
          Task complexity
          <v-rating
            v-model="ratingData.rating"
            full-icon="offline_bolt"
            empty-icon="offline_bolt"
            :hover="ratingData.hover"
            :length="ratingData.length"
            background-color="grey lighten-1"
            color="blue"
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
  @Prop(String) uid
  @Prop({ default: false }) value

  name = ''
  description = ''
  date = ''
  pickerDialog = false

  ratingData = {
    hover: true,
    length: 5,
    rating: 0
  }

  showDialog = false

  /**
   * Close dialog, triggering v-model event
   */
  closeDialog () {
    this.showDialog = false
    this.$emit('input', this.showDialog)
    this.$v.$reset()
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
      date: this.date,
      groupId: this.groupData.groupId,
      description: this.description
    }

    FirebaseService.createTask(taskId, data)
      .then(() => {
        this.addTaskIdToGroupData(this.groupData.groupId, taskId)
        this.flash('Task succesfully added', 'success')
      })
      .catch(err => {
        this.flash(err.message, 'success')
      })
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
        this.flash('Added new task to group', 'success')
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
    this.showDialog = this.value
    this.name = ''
    this.description = ''
    this.ratingData = {
      hover: true,
      length: 5,
      rating: 0
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
