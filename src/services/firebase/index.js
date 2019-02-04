import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

/*
  Firebase authentication service
 */

/**
 * Auth request
 */
function authRequest () {
  return firebase.auth()
}

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
 * Database service
 */

/**
 * Firebase request
 * @param {String} url
 * @return {Promise}
 */
function firebaseRequest (url) {
  return firebase.database().ref(url)
}

/**
 * Search in firebase
 * Usage: "FirebaseService.searchByValueRef(refUrl, orderByValue, searchingValue).on(snapshot => snapshot.val())"
 * @param  {String} refUrl
 * @param  {String} orderByValue
 * @param  {String} searchingValue
 * @return {[type]}
 */
function searchByValueRef (url, orderByValue, searchingValue) {
  return firebaseRequest(url).orderByChild(orderByValue).equalTo(searchingValue)
}

/**
 * Users service
 */

/**
 * Post user to database
 * @param  {String} userId
 * @param  {Object} data
 * @return {Promise}
 */
function writeUserData (userId, data) {
  return firebaseRequest('users/' + userId).set({
    uid: userId,
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    email: data.email
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
function createGroup (groupId, name, owner, members = [owner]) {
  return firebaseRequest('groups/' + groupId).set({
    groupId: groupId,
    name: name,
    owner: owner,
    members: members
  })
}

const FirebaseService = {
  registerUser,
  signIn,
  signOut,
  getUser,
  writeUserData,
  createGroup,
  firebaseRequest,
  searchByValueRef,
  authRequest
}

export default FirebaseService
