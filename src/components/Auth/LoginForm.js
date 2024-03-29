import React, { useRef, useState } from "react";
import "./LoginForm.css";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authAction } from "../../store/auth";

function LoginForm() {
  const history = useHistory();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [password, confirmPassword] = useState(true);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    setIsLoading(true);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDl59FNr821JozVke_Wjr1BV-fNPs8ex2k",
      {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        confirmPassword(true);
        confirmPassword("Sucessfull!");
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          res.json().then((data) => {
            let errorMsg = "Authotication Failed";
            if (data && data.error && data.error.message) {
              errorMsg = data.error.message;
            }
            confirmPassword(errorMsg);
            throw new Error(errorMsg);
          });
        }
      })
      .then((data) => {
        if (data.idToken) {
          localStorage.setItem("token", data.idToken);
          dispatch(authAction.login(data.idToken));
        }
        localStorage.setItem("email", data.email.replace(/[@.]/g, ""));

        history.replace("./home");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="login">
      <h2>Login Form</h2>
      <div className="body">
        <div>
          <label className="label">Email </label>
          <input type="email" id="email" ref={emailRef} placeholder="Email" />
        </div>
        <div>
          <label className="label">Password </label>
          <input
            type="password"
            id="password"
            ref={passwordRef}
            placeholder="Password"
          />
        </div>
        {password}
      </div>
      <div className="foo">
        <button type="submit" className="btn">
          Login
        </button>
        {isLoading && <p>Loading....</p>}
      </div>
      <p>
        Don't Have an account? <Link to="/register">Register</Link>
      </p>
      <Link to="/forget">
        <i>Forget password</i>
      </Link>
    </form>
  );
}

export default LoginForm;
