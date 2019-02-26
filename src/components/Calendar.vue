<template>
  <v-layout column wrap>
    <v-flex>
      <v-sheet>
        now
        <v-calendar
          ref="calendar"
          color="red"
          type="month"
          v-model="start"
          :end="end"
          :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        >
          <template
            slot="day"
            slot-scope="{ date }"
          >
            <template v-for="event in eventsMap[date]">
              <v-menu
                :key="event.name"
                :close-on-content-click="false"
                v-model="event.open"
                full-width
                offset-x
              >
                <div
                  slot="activator"
                  v-ripple
                  class="my-event mt-1"
                  :style="event.owner ? `border: 3px solid ${groupData.colors[event.owner]}` : ''"
                  v-html="event.name"
                ></div>
                <v-card
                  color="grey lighten-4"
                  min-width="350px"
                  flat
                >
                  <v-toolbar
                    color="black lighten-4"
                    dark
                  >
                    <v-toolbar-title dark v-html="event.name"></v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-card-text class="text-sm-left font-weight-bold">
                    <v-layout row wrap align-center class="my-1">
                      <v-icon class="mr-2">description</v-icon>
                      <span v-if="event.description">{{event.description}}</span>
                      <span v-else class="no-description">none</span>
                    </v-layout>
                    <v-layout row wrap align-center class="my-1">
                      <v-icon class="mr-2">account_circle</v-icon>
                      <span v-if="event.owner">{{event.ownerUsername}}</span>
                      <span v-else class="no-description">none</span>
                    </v-layout>
                    <v-layout row wrap align-center class="my-1">
                      <v-icon class="mr-2">offline_bolt</v-icon>
                      <span>{{event.rating}}</span>
                    </v-layout>
                  </v-card-text>
                  <v-spacer></v-spacer>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn
                      flat
                      color="secondary"
                      @click="event.open = false"
                    >
                      Cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </template>
          </template>
        </v-calendar>
      </v-sheet>
    </v-flex>
    <v-layout row wrap justify-space-between class="mt-3">
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
    </v-layout>
  </v-layout>
</template>

<script>
import { Component, Vue, Prop } from 'vue-property-decorator'
import moment from 'moment'

@Component({
  name: 'Calendar'
})
/**
 * Calendar Component
 */
export default class Calendar extends Vue {
  @Prop(Array) tasksData
  @Prop(Object) groupData
  @Prop(Function) findUsername

  start = ''
  end = ''

  mounted () {
    this.getFirstDateOfMonth()
  }

  getFirstDateOfMonth () {
    const firstDate = moment().startOf('month').format('YYYY-MM-DD')
    const lastDate = moment().endOf('month').format('YYYY-MM-DD')
    this.start = firstDate
    this.end = lastDate
  }

  /**
   * Convert the list of events into a map of lists keyed by date
   * @return {Array} map
   */
  get eventsMap () {
    const map = {}
    this.tasksData.forEach(e => (map[e.date] = map[e.date] || []).push(e))
    return map
  }
}
</script>

<style lang="stylus" scoped>
  .my-event {
  border: 0.5px solid grey
  border-radius: 7px
  padding: 0 5px
  font-weight: bold
  }
.no-description {
  color: grey
}
.v-calendar-weekly__week {
  min-height: 170px !important
}
</style>
