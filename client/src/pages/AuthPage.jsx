import React from "react";
import SignUpForm from "../features/SignUpForm/SignUpForm";

export default function AuthPage({ setUser }) {
  return (
    <div>
      <SignUpForm setUser={setUser} />
    </div>
  );
}