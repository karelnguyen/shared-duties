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
          v-model="formData.name"
          name="name"
          label="name"
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
import FirebaseService from '@/services/firebase'

@Component({
  name: 'DialogGroup'
})
/**
 * Dialog Group Component
 */
export default class DialogGroup extends Vue {
  @Prop(Boolean) editMode
  @Prop({ default: false }) value

  formData = {
    name: ''
  }

  showDialog = false

  /**
   * Close dialog, triggering v-model event
   */
  closeDialog () {
    this.showDialog = false
    this.$emit('input', this.showDialog)
  }

  /**
   * Confirm dialog
   * @return {Promise}
   */
  confirmDialog () {
    const groupId = this.generateRandomId()
    const ownerUid = localStorage.getItem('uid')

    FirebaseService.createGroup(groupId, this.formData.name, ownerUid)
      .then(() => {
        this.closeDialog()
        this.flash(`Group ${this.formData.name} succesfully created`, 'success')
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
  }
}
</script>

<style lang="stylus" scoped>
</style>
