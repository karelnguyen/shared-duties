import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

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
 * Get current user data
 * @return {Object}
 */
function getUser () {
  return firebase.auth().currentUser
}

/**
 * Users service
 */

/**
 * Post user to database
 * @param  {String} userId
 * @param  {String} name
 * @param  {String} email
 * @return {Promise}
 */
function writeUserData (userId, name, email) {
  return firebase.database().ref('users/' + userId).set({
    uid: userId,
    username: name,
    email: email
  })
}

/**
 * Groups service
 */

/**
 * Post group
 * @param  {String} groupId
 * @param  {String} name
 * @param  {String} owner uid
 * @param  {Array}  [tasks=[]]
 * @return {Promise}
 */
function createGroup (groupId, name, owner, tasks = []) {
  return firebase.database().ref('groups/' + groupId).set({
    groupId: groupId,
    name: name,
    owner: owner,
    tasks: tasks
  })
}

const FirebaseService = {
  registerUser,
  signIn,
  signOut,
  getUser,
  writeUserData,
  createGroup
}

export default FirebaseService
