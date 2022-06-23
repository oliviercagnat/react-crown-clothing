import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCm6fwd3KVIgtYdTf3NLHeLOLK-Em7PvFU",
  authDomain: "crown-clothing-408f7.firebaseapp.com",
  projectId: "crown-clothing-408f7",
  storageBucket: "crown-clothing-408f7.appspot.com",
  messagingSenderId: "904825620741",
  appId: "1:904825620741:web:4f11b0d94f12c5f86e4f6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

// Initialize DB
export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth) => {
  // Here we get the User Document Reference inside the DB, 
  // inside the 'users' collection, with userAuth UID.
  const userDocRef = doc(db, 'users', userAuth.uid);

  // get the document for userDocRef
  const userSnapshot = await getDoc(userDocRef);

  // We check if snapshot exist
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    // if doesn't exist, we set it inside our DB
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
};