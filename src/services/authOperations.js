import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../config/firebase";

/**
 * Signs in a user with email and password.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} User credential object.
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user.emailVerified) {
      toast.success("User logged in successfully");
      return userCredential;
    } else {
      toast.error("Email not verified");
      toast.info("Check your mail for verification link");
      throw new Error("Email not verified");
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error.message);
    throw error;
  }
};

/**
 * Creates a new user account with email and password.
 * @param {string} name - User's display name.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} User object.
 */
export const signupUser = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = auth.currentUser;

    await updateProfile(user, {
      displayName: name,
      photoURL:
        "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1727758525~exp=1727759125~hmac=29ddd273ae3b1d89c550dc741440f22f2fa13bd3fda8f1ca528f3ae6d361275e",
    });

    await sendEmailVerification(user);
    toast.info("Verification email sent. Please verify your email.");

    return user;
  } catch (error) {
    console.error("Signup error:", error);
    toast.error(error.message);
    throw error;
  }
};

/**
 * Sends a password reset email to the specified email address.
 * @param {string} email - The email address to send the reset link to.
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.info("Password reset message sent to the entered email");
  } catch (error) {
    console.error("Password reset error:", error);
    toast.error(error.message);
    throw error;
  }
};
