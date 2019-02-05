<template>
  <div class="flash-wrap">
    <v-alert
      :icon="getAlertIcon(item.context)"
      :color="item.context"
      :key="index"
      v-for="(item, index) in notifications"
      v-model="item.show"
      dismissible
      transition="slide-y-reverse-transition"
    >
      <div v-html="item.message" class="scroll-y flash-content"></div>
    </v-alert>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'FlashMessage'
})
/**
 * Flash message
 */
export default class FlashMessage extends Vue {
  show = false
  notifications = []
  timeout = 10000
  flashTemp = null

  /**
   * Called functions when component created
   */
  created () {
    this.$eventHub.$on('flash', (message, context, timeout) => this.flash(message, context, timeout))
  }

  /**
   * Show flash message
   * @param {String} message to show
   * @param {String} context error / info / warning / success
   * @param {Number} timeout after then hide message (optional)
   */
  flash (message, context, timeout = this.timeout) {
    if (message == null || this.flashTemp === message) {
      return
    }
    this.flashTemp = message
    setTimeout(() => {
      this.flashTemp = null
    }, 1000)
    this.notifications.push({
      message: message,
      context: context,
      timeout: timeout,
      show: true
    })
    setTimeout(this.hide, timeout)
  }

  /**
   * Hide flash message
   * @param {any} item to hide
   */
  hide (item = this.notifications[0]) {
    let key = this.notifications.indexOf(item)

    this.notifications[key].show = false
    this.notifications.splice(key, 1)
  }

  /**
   * Get code of icon for message context
   * @param {string} messageContext of flash messasge
   * @returns {string} icon message code
   */
  getAlertIcon (messageContext) {
    switch (messageContext) {
      case 'success' : return 'check_circle'
      case 'warning' : return 'priority_high'
      default : return messageContext
    }
  }
}
</script>

<style lang="stylus" scoped>
  .flash-wrap
    position: fixed
    top: 0
    left: 0
    right: 0
    margin: 0 auto
    max-width: 100%
    z-index:9999

    @media (min-width: 768px)
      max-width: 500px

  .flash
    display: flex
    border: 0
    margin: 0 0 2px
    padding: 10px 16px
    &--text
      flex: 1 1 auto

  .flash-content
    max-height 500px

  .btn--close
    margin: 0 0 0 10px
    width: 20px
    height: 20px
    &:hover .icon
      background: rgba(0, 0, 0, .15)
</style>
