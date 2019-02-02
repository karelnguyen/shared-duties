import firebase from 'firebase/app'
require('firebase/auth')

function registerUser (email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}

const FirebaseService = {
  registerUser
}

export default FirebaseService
