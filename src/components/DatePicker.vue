<template>
  <v-layout row wrap>
    <v-menu
      ref="pickerDialog"
      v-model="pickerDialog"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="date"
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
        readonly
      ></v-text-field>
      <v-date-picker @input="saveDate(date)" v-model="date" no-title scrollable></v-date-picker>
    </v-menu>
  </v-layout>
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

  /**
   * Save date data
   * @param  {String} date
   */
  saveDate (date) {
    this.$refs.pickerDialog.save(date)
    this.pickerDialog = false
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
