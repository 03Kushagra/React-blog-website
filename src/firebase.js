import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvBtGBO6B1GDgTajjYn9ey4Wdxgix7Cj8",
  authDomain: "react-blog-website-25bd4.firebaseapp.com",
  projectId: "react-blog-website-25bd4",
  storageBucket: "react-blog-website-25bd4.appspot.com",
  messagingSenderId: "579819948796",
  appId: "1:579819948796:web:6a0259269606731997a579"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
