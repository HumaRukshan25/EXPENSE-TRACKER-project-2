import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { useSelector } from "react-redux";

const Home = () => {
  const token = useSelector((state) => state.auth.token);

  const emailHandler = (e) => {
    e.preventDefault();
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBp775nxqAUycefh3bAxwNopderwT7z1gY",
      {
        method: "POST",
        body: JSON.stringify({
          requestType: "VERIFY_EMAIL",
          idToken: token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          res.json().then((data) => {
            let errorMsg = "Authotication Failed";
            if (data && data.error && data.error.message) {
              errorMsg = data.error.message;
            }
            throw new Error(errorMsg);
          });
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <>
      <header className="head">
        <h3 className="expense">Welcome to Expense Tracker</h3>
        <h3 className="profile">
          Your profile is incomplete <Link to="Profile">Complete now</Link>
        </h3>
        <br />
      </header>
      <div className="verify">
        <h2>Verify your email </h2>
        <button className="bt" onClick={emailHandler}>
          Verify E-mail
        </button>
      </div>
    </>
  );
};

export default Home;
