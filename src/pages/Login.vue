<template>
  <v-container>
    <v-layout column wrap justify-center align-center align-content-center>
      <h1>Login page</h1>
      <v-flex mt-5>
        <v-text-field
          v-model="email"
          name="email"
          label="email"
          outline
          class="login-input"
        ></v-text-field>
      </v-flex>
      <v-text-field
        v-model="password"
        name="password"
        label="password"
        outline
        class="login-input"
      ></v-text-field>
      <v-btn color="blue" dark round @click="signIn(email, password)">Sign in</v-btn>
      <p>
        Did not register yet? <v-btn flat @click="$router.push({name: 'signup'})">Sign up</v-btn>
      </p>
    </v-layout>
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import FirebaseService from '@/services/firebase'

@Component({
  name: 'Login'
})
/**
 * Login Page
 */
export default class Login extends Vue {
  email = ''
  password = ''

  /**
   * Sign in with email and password
   * @param  {String} email
   * @param  {String} password
   * @return {Promise}
   */
  signIn (email, password) {
    FirebaseService.signIn(email, password)
      .then(() => {
        this.$router.replace('/dashboard')
      })
      .catch(err => {
        alert(err.message)
      })
  }
}
</script>

<style lang="stylus" scoped>
  .login-input {
    width: 300px
  }
</style>
