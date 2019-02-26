<template>
    <v-menu
      v-model="pickerDialog"
      :close-on-content-click="false"
      :nudge-right="40"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px"
    >
    <v-text-field
      slot="activator"
      v-model="date"
      label="Date of task"
      prepend-icon="event"
      clearable
      readonly
    ></v-text-field>
    <v-date-picker @input="pickerDialog = false" v-model="date" no-title scrollable></v-date-picker>
  </v-menu>
</template>

<script>
import { Component, Watch, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'DatePicker'
})
/**
 * DatePicker Component
 */
export default class DatePicker extends Vue {
  @Prop({ default: '' }) value

  pickerDialog = false
  date = ''

  mounted () {
    this.resetData()
  }

  /**
   * Reset input data
   */
  resetData () {
    this.$data.date = ''
  }

  /**
   * Watcher for date
   */
  @Watch('date')
  changeValue () {
    this.$emit('input', this.date)
  }
}
</script>

<style lang="stylus" scoped>
</style>
