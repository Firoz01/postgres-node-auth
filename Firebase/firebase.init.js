const firebaseConfig = require('./firebase.config');
const { initializeApp } = require('firebase/app');

const initializeFirebase = () => {
  initializeApp(firebaseConfig);
};

module.exports = initializeFirebase;
