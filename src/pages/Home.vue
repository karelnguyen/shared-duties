<template>
  <v-layout column wrap justify-center align-center class="home-page">
    <h1 class="display-4 mb-5">Shared Duties</h1>
    <v-btn dark outline color="white" @click="$router.push({name: 'login'})">Sign in</v-btn>
    <v-btn dark outline color="white" @click="$router.push({name: 'signup'})">Sign up</v-btn>
  </v-layout>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Home'
})
/**
 * Login Page
 */
export default class Home extends Vue {}
</script>

<style lang="stylus" scoped>
.home-page {
  height: 100vh
  weight: 100vw
  color: white
}
</style>
