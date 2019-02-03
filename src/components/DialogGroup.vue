<template>
  <v-container>
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
          Privacy Policy
        </v-card-title>

        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="closeDialog"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// import { Prop, Emit, Watch, Component, Vue } from 'vue-property-decorator'
import { Prop, Component, Watch, Vue } from 'vue-property-decorator'

@Component({
  name: 'DialogGroup'
})
/**
 * Dialog Group Component
 */
export default class DialogGroup extends Vue {
  @Prop(String) type
  @Prop({ default: false }) value

  showDialog = false

  /**
   * Mounted actions at beginning
   */
  mounted () {
  }

  /**
   * Close dialog, triggering v-model event
   */
  closeDialog () {
    this.showDialog = false
    this.$emit('input', this.showDialog)
  }

  @Watch('value')
  initData () {
    this.showDialog = this.value
  }
}
</script>

<style lang="stylus" scoped>
</style>
