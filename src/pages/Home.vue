<template>
  <div>
    <h1>Home</h1>
    <v-btn flat @click="$router.push({name: 'login'})">Sign in</v-btn>
    <v-btn flat @click="$router.push({name: 'signup'})">Sign up</v-btn>
  </div>
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
</style>
