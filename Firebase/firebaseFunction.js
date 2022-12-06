const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require('firebase/auth');
const initializeFirebase = require('../Firebase/firebase.init');

initializeFirebase();
const auth = getAuth();

exports.createFirebaseUser = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    return error.code;
  }
};

exports.signInFirebaseUser = async (email, password) => {
  try {
    const result = signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    return error;
  }
};
