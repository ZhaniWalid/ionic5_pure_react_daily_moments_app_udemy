// Use this cmd: 'npm install firebase' in the 'Integrated Terminal of VS CODE' or 'Terminal of Windows' to install it
import firebase from 'firebase/app';
import 'firebase/auth'; // for enabling authentication with firebase
import 'firebase/firestore'; // for enabling Cloud Firestore with firebase
import 'firebase/storage'; // for enabling Cloud Storage with firebase

// My Firebase Config from => Settings/Project Settings/General => Firebase SDK snippet => Config
const firebaseConfig = {
    apiKey: "myApiKey",
    authDomain: "myAuthDomain",
    projectId: "myProjectId",
    storageBucket: "myStorageBucket",
    messagingSenderId: "myMessagingSenderId",
    appId: "myAppId"
};

// Creates and initializes a Firebase {@link firebase.app.App app} instance
const firebaseApp = firebase.initializeApp(firebaseConfig);

export const firebaseAuth = firebaseApp.auth(); // for enabling authentication with firebase
export const firestore = firebaseApp.firestore(); // for enabling Cloud Firestore with firebase
export const firebaseCloudStorage = firebaseApp.storage(); // for enabling Cloud Storage with firebase