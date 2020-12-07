import Firebase from "firebase";
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "invoices-590c9.firebaseapp.com",
  databaseURL: "https://invoices-590c9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "invoices-590c9",
  storageBucket: "invoices-590c9.appspot.com",
  messagingSenderId: "1069657450639",
  appId: "1:1069657450639:web:2aa4f478bcbfcbb2a6a8fa"
};

const app = Firebase.initializeApp(firebaseConfig);
export const db = app.database();
