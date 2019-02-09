<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-flex
        xs12
        class="mb-3"
      >
        <v-sheet height="500">
          <v-calendar
            ref="calendar"
            color="primary"
          ></v-calendar>
        </v-sheet>
      </v-flex>

      <v-flex
        sm4
        xs12
        class="text-sm-left text-xs-center"
      >
        <v-btn @click="$refs.calendar.prev()">
          <v-icon
            dark
            left
          >
            keyboard_arrow_left
          </v-icon>
          Prev
        </v-btn>
      </v-flex>
      <v-flex
        sm4
        xs12
        class="text-sm-right text-xs-center"
      >
        <v-btn @click="$refs.calendar.next()">
          Next
          <v-icon
            right
            dark
          >
            keyboard_arrow_right
          </v-icon>
        </v-btn>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Calendar'
})
/**
 * Calendar Component
 */
export default class Calendar extends Vue {
}
</script>

<style lang="stylus" scoped>
</style>
