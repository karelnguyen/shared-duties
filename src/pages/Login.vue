<template>
  <v-container justify-center align-center align-content-center>
    <v-card tile>
      <v-card-title
        class="headline lighten-2"
        primary-title
        >
        Login
        <v-spacer></v-spacer>
        <v-icon>supervisor_account</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-layout column wrap justify-center align-center align-content-center class="login-area">
          <v-flex mt-5>
          <v-text-field
            :error-messages="vErrors('email')"
            v-model="email"
            name="email"
            label="email"
            outline
            class="login-input"
          ></v-text-field>
        </v-flex>
        <v-text-field
          :error-messages="vErrors('password')"
          v-model="password"
          name="password"
          label="password"
          type="password"
          outline
          class="login-input"
        ></v-text-field>
        <v-btn color="blue"  round @click="signIn(email, password)">Sign in</v-btn>
        <p class="font-color">
          Did not register yet? <v-btn  flat @click="$router.push({name: 'signup'})">Sign up</v-btn>
        </p>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import FirebaseService from '@/services/firebase'
import { required, email } from 'vuelidate/lib/validators'

@Component({
  name: 'Login',
  validations: {
    email: {
      required, email
    },
    password: {
      required
    }
  }
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
    this.$v.$touch()
    if (this.$v.$invalid) {
      return
    }
    FirebaseService.signIn(email, password)
      .then(() => {
        this.$router.push('/dashboard')
        this.flash('Succesfully logged in', 'success')
      })
      .catch(err => {
        this.flash(err.message, 'error')
      })
  }
}
</script>

<style lang="stylus" scoped>
  .login-input {
    width: 300px
  }
  .font-color {
    color: black
  }
</style>
