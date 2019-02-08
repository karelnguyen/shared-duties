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
        <span class="mr-1" v-if="!editMode">Add</span> <span v-else>Edit</span>group
      </v-card-title>

      <v-card-text>
        <v-text-field
          :error-messages="forbiddenGroup ? 'Group name is taken!' : vErrors('name')"
          v-model="name"
          name="name"
          label="name"
          prepend-icon="group_add"
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="closeDialog">Close</v-btn>
        <v-btn
          color="primary"
          flat
          @click="confirmDialog()"
        >
          <span class="mr-1" v-if="!editMode">Add</span> <span v-else>Edit</span>Group
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
  name: 'DialogGroup',
  validations: {
    name: {
      required
    }
  }
})
/**
 * Dialog Group Component
 */
export default class DialogGroup extends Vue {
  @Prop(Boolean) editMode
  @Prop({ default: false }) value

  name = ''
  showDialog = false
  forbiddenGroup = false
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
    const groupId = this.generateRandomId()
    const ownerUid = localStorage.getItem('uid')

    if (!this.checkGroupName(this.name)) {
      this.forbiddenGroup = true
      this.flash(`Group ${this.name} already exist, please choose another name`, 'warning')
      return
    }
    this.forbiddenGroup = false
    FirebaseService.createGroup(groupId, this.name, ownerUid)
      .then(() => {
        this.closeDialog()
        this.flash(`Group ${this.name} succesfully created`, 'success')
      })
      .catch(err => {
        this.flash(err.message, 'error')
      })
  }

  /**
   * Checks if group name is taken
   * @param  {String} name
   * @return {Boolean} true, if group name is available
   */
  checkGroupName (name) {
    let available = true
    let ownGroups = this.$store.state.user.ownGroups
    ownGroups.map(group => {
      if (group.name.toLowerCase() === name.toLowerCase()) {
        available = false
      }
    })
    return available
  }

  /**
   * Watcher for value
   */
  @Watch('value')
  initData () {
    this.showDialog = this.value
    this.name = ''
    this.forbiddenGroup = false
  }
}
</script>

<style lang="stylus" scoped>
</style>
