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

      <v-card-text>
        <v-text-field
          :error-messages="vErrors('name')"
          v-model="name"
          name="name"
          label="Task name"
        ></v-text-field>
        <v-text-field
          v-model="description"
          name="description"
          label="Description"
        ></v-text-field>
      </v-card-text>

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

@Component({
  name: 'DialogTask',
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
  @Prop(String) groupId
  @Prop(String) uid
  @Prop({ default: false }) value

  name = ''
  description = ''
  points = ''

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
      points: this.points,
      date: '',
      groupId: this.groupId,
      description: this.description
    }

    FirebaseService.createTask(taskId, data)
      .then(() => {
        this.flash('Task succesfully added', 'success')
      })
      .catch(err => {
        this.flash(err.message, 'success')
      })
  }

  /**
   * Watcher for value
   */
  @Watch('value')
  initData () {
    this.showDialog = this.value
    this.name = ''
  }
}
</script>

<style lang="stylus" scoped>
</style>
