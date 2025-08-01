import React, { useState } from "react";
import { resetPassword } from "../../services/authOperations";
import classes from "./ResetPassword.module.css";
const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    try {
      await resetPassword(email);
    } catch (error) {
      console.error("Password reset error:", error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.resetPassword}>
        <h1>Reset Password</h1>
        <div className={classes.resetPasswordDiv}>
          <label className={classes.resetPasswordLabel}>Email</label>
          <input
            type="email"
            placeholder="Email"
            className={classes.resetPasswordInput}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className={classes.resetPasswordButton}
          onClick={handleResetPassword}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
