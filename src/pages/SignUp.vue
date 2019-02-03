<template>
  <v-container>
    <v-layout column wrap justify-center align-center align-content-center>
      <h1>Sign up page</h1>
      <v-flex mt-5>
        <v-text-field
          v-model="email"
          name="email"
          label="email"
          outline
          class="sign-up-input"
        ></v-text-field>
      </v-flex>
      <v-flex>
        <v-text-field
          v-model="password"
          name="password"
          label="password"
          outline
          class="sign-up-input"
        ></v-text-field>
      </v-flex>
      <v-btn color="blue" dark round @click="signUp(email, password)">Sign up</v-btn>
      <p>
        Already signed up? <v-btn flat @click="$router.push({name: 'login'})">Sign in</v-btn>
      </p>
    </v-layout>
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import FirebaseService from '@/services/firebase'

@Component({
  name: 'SignUp'
  })
/**
 * Sign Up Page
 */
export default class SignUp extends Vue {
  email = ''
  password = ''

  /**
   * Sign up user with email and password
   * @param  {String} email
   * @param  {String} password
   * @return {Promise}
   */
  signUp (email, password) {
    FirebaseService.registerUser(email, password)
      .then(() => {
        alert('user added')
        this.$router.replace('/login')
      })
      .catch(err => {
        alert(err.message)
      })
  }
}
</script>

<style lang="stylus" scoped>
  .sign-up-input {
    width: 300px
  }
</style>
