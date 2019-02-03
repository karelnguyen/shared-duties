<template>
  <v-container>
    Dashboard
    <v-btn color="black" dark @click="signOut">Sign out</v-btn>
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import FirebaseService from '@/services/firebase'

@Component({
  name: 'Dashboard'
})
/**
 * Dashboard Page
 */
export default class Dashboard extends Vue {
  signOut () {
    FirebaseService.signOut()
  }
}

</script>

<style lang="stylus" scoped>
</style>
