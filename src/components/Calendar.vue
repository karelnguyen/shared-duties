<template>
  <v-layout>
    <v-flex>
      <v-sheet height="500">
        <v-calendar
          color="primary"
        >
          <template
            slot="day"
            slot-scope="{ date }"
          >
            <template v-for="event in eventsMap[date]">
              <v-menu
                :key="event.name"
                v-model="event.open"
                full-width
                offset-x
              >
                <div
                  slot="activator"
                  v-ripple
                  class="my-event"
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
                    <v-btn icon>
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-toolbar-title dark v-html="event.name"></v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                      <v-icon>favorite</v-icon>
                    </v-btn>
                    <v-btn icon>
                      <v-icon>more_vert</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-card-title>
                    <span v-html="event.description"></span>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn
                      flat
                      color="secondary"
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
  </v-layout>
</template>

<script>
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'Calendar'
})
/**
 * Calendar Component
 */
export default class Calendar extends Vue {
  @Prop(Array) tasksData

  today = '2019-02-08'

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
</style>
