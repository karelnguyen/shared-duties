<template>
  <v-container>
    <v-layout column wrap justify-center align-center align-content-center class="sign-up-area">
      <h1>Sign up page</h1>
      <v-flex mt-5>
        <v-text-field
          v-model="username"
          name="username"
          label="username"
          outline
          class="sign-up-input"
        ></v-text-field>
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
  username = ''
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
      .then(response => {
        this.addUserToDb(response.user.uid, this.username, this.email)
        alert('user added')
        this.$router.replace('/login')
      })
      .catch(err => {
        alert(err.message)
      })
  }

  /**
   * Add user to firebase db
   * @param {String} uid
   * @param {String} username
   * @param {String} email
   */
  addUserToDb (uid, username, email) {
    FirebaseService.writeUserData(uid, username, email)
  }
}
</script>

<style lang="stylus" scoped>
  .sign-up-input {
    width: 300px
  }
  .sign-up-area {
    margin-top: 200px
  }
</style>
