import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB0C--NozZTeoAP_sj9FHTzQI66SfIIPkA",
  authDomain: "aurevia-health.firebaseapp.com",
  projectId: "aurevia-health",
  storageBucket: "aurevia-health.appspot.com",
  messagingSenderId: "861450572451",
  appId: "1:861450572451:web:90bc97a727b040d12b2516"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
