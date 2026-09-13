// This file connects the site to your Firebase project's Firestore database.
// It's safe to publish publicly on GitHub — these are not secret keys, they just tell
// your site which Firebase project to talk to. The admin login is a simple username/password
// check inside admin.html, not Firebase Authentication (see SETUP.md for details).

const firebaseConfig = {
  apiKey: "AIzaSyBOo8L66OMZFTMuvpZ4OfTNmAH3bkQnVq8",
  authDomain: "maldivian-airlines-roblox.firebaseapp.com",
  projectId: "maldivian-airlines-roblox",
  storageBucket: "maldivian-airlines-roblox.firebasestorage.app",
  messagingSenderId: "617930602475",
  appId: "1:617930602475:web:7b8bc8706938ad06fd0bae"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
