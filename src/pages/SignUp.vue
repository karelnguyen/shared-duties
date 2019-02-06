<template>
  <v-container>
    <v-card tile>
      <v-card-title
        class="headline lighten-2"
        primary-title
        >
        Sign up
        <v-spacer></v-spacer>
        <v-icon>all_inbox</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-layout column wrap justify-center align-center align-content-center class="sign-up-area">
        <v-flex mt-5>
          <v-text-field
            :error-messages="vErrors('firstName')"
            v-model="firstName"
            name="firstName"
            label="first name"
            outline
            class="sign-up-input"
            required
          ></v-text-field>
          <v-text-field
            :error-messages="vErrors('lastName')"
            v-model="lastName"
            name="lastName"
            label="last name"
            outline
            class="sign-up-input"
          ></v-text-field>
          <v-text-field
            :error-messages="forbiddenUsername ? 'Username is taken!' : vErrors('username')"
            v-model="username"
            name="username"
            label="username"
            outline
            class="sign-up-input"
            @input="isUsernameAvailable(username)"
          ></v-text-field>
          <v-text-field
            :error-messages="vErrors('email')"
            v-model="email"
            name="email"
            label="email"
            outline
            class="sign-up-input"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            :error-messages="vErrors('password')"
            v-model="password"
            name="password"
            label="password"
            type="password"
            outline
            class="sign-up-input"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            :error-messages="vErrors('repeatPassword')"
            v-model="repeatPassword"
            name="repeatPassword"
            label="repeat password"
            type="password"
            outline
            class="sign-up-input"
          ></v-text-field>
        </v-flex>
        <v-btn color="black" dark round @click="signUp(email, password, username)">Sign up</v-btn>
        <p>
          Already signed up? <v-btn flat @click="$router.push({name: 'login'})">Sign in</v-btn>
        </p>
      </v-layout>

    </v-card>
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import FirebaseService from '@/services/firebase'
import { required, email, sameAs } from 'vuelidate/lib/validators'

@Component({
  name: 'SignUp',
  validations: {
    firstName: {
      required
    },
    lastName: {
      required
    },
    username: {
      required
    },
    email: {
      required,
      email
    },
    password: {
      required
    },
    repeatPassword: {
      required,
      sameAsPassword: sameAs('password')
    }
  }
})
/**
 * Sign Up Page
 */
export default class SignUp extends Vue {
  firstName = ''
  lastName = ''
  username = ''
  email = ''
  password = ''
  repeatPassword = ''
  forbiddenUsername = false

  /**
   * Sign up user with email and password
   * @param  {String} email
   * @param  {String} password
   * @return {Promise}
   */
  signUp (email, password, username) {
    this.$v.$touch()
    if (this.$v.$invalid) {
      return
    }
    if (this.forbiddenUsername) {
      this.flash('Username is already taken', 'error')
      return
    }
    FirebaseService.registerUser(email, password)
      .then(response => {
        let data = {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          email: this.email
        }
        this.addUserToDb(response.user.uid, data)
        this.flash('Succesfully registered', 'success')
        this.flash('Log in to get to dashboard', 'info')
        this.$router.replace('/login')
      })
      .catch(err => {
        this.flash(err.message, 'error')
      })
  }

  /**
   * Check if username is taken
   * @param  {String} username
   * @return {Boolean} true, if username is available
   */
  isUsernameAvailable (username) {
    this.$v.username.$touch()
    this.forbiddenUsername = false
    FirebaseService.searchByValueRef('/users', 'username', username).on('value', snapshot => {
      if (snapshot.val()) {
        this.forbiddenUsername = true
      }
    })
  }

  /**
   * Add user to firebase db
   * @param {uid} uid user id
   * @param {Object} data form data
   */
  addUserToDb (uid, data) {
    FirebaseService.writeUserData(uid, data)
  }
}
</script>

<style lang="stylus" scoped>
  .sign-up-input {
    width: 300px
  }
  .sign-up-area {
    margin-top: 20px
  }
</style>
