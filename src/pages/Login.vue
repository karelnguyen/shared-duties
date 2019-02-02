<template>
  <div class="flash-wrap">
    <h3>Login Page</h3>
    <v-text-field
      name="email"
      label="email"
    ></v-text-field>
    <v-text-field
      name="password"
      label="password"
    ></v-text-field>
    <v-btn color="primary" @click="goHome">Sign in</v-btn>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Login'
  })
/**
 * Login Page
 */
export default class Login extends Vue {
  goHome () {
    this.$router.replace('/')
  }
}
</script>

<style lang="stylus" scoped>
</style>
