import firebase from 'firebase/app'
require('firebase/auth')

/*
  Firebase authentication service
 */

/**
 * Register user with email and password
 * @param  {String} email
 * @param  {String} password
 * @return {Promise}
 */
function registerUser (email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}

/**
 * Sign in user with email and password
 * @param  {String} email
 * @param  {String} password
 * @return {Promise}
 */
function signIn (email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password)
}

/**
 * Sign out
 * @return {Promise}
 */
function signOut () {
  return firebase.auth().signOut()
}

/**
 * Check if user is signed in
 * @return {Boolean}
 */
function isSignIn () {
  firebase.auth().onAuthStateChanged(user => user)
}

/**
 * Get current user data
 * @return {Object}
 */
function getUser () {
  return firebase.auth().currentUser
}

const FirebaseService = {
  registerUser,
  signIn,
  signOut,
  isSignIn,
  getUser
}

export default FirebaseService
