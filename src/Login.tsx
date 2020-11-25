import React from "react";
import "./App.css";

export default function Login() {
  const callBackendAPI = async () => {
    const response = await fetch("/express_backend");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    console.log(body);

    return body;
  };

  // callBackendAPI();

  return (
    <div className="login-window">
      <div className="login">
        Username: <input className="username" type="text" />
      </div>
      <div className="login">
        Password: <input className="password" type="password" />
      </div>
    </div>
  );
}
