import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, sendPasswordResetEmail, updatePassword, updateEmail, sendEmailVerification } from "firebase/auth";

export const doCreateUserwithEmailAndPassword = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
}

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
}

export const doSignInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

export const doSignOut = () => {
  return signOut(auth);
}

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
}

export const doPasswordUpdate = (password) => {
    return updatePassword(auth.currentUser, password);
}

export const doUpdateEmail = (email) => {
    return updateEmail(auth.currentUser, email);
}

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser);
}
