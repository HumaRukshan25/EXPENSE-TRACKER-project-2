import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";
import { useSelector } from "react-redux";

const Profile = () => {
  const nameRef = useRef();
  const bioRef = useRef();
  const telRef = useRef();
  const token = useSelector((state) => state.auth.token);

  const [getName, setGetName] = useState("");
  const [getBio, setBio] = useState("");
  const [getTelephone, setTelephone] = useState("");
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    const savedProfileData = JSON.parse(localStorage.getItem("profileData"));

    if (savedProfileData) {
      setGetName(savedProfileData.displayName || "");
      setBio(savedProfileData.bio || "");
      setTelephone(savedProfileData.telephone || "");
      checkProfileCompletion(savedProfileData);
    } else {
      fetchData();
    }
  }, [token]);

  const fetchData = () => {
    fetch(`https://crudcrud.com/api/340512f732ef4d9daa7e276334a81198/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const user = data[0]; // Assuming the first element contains the user data
        setGetName(user.displayName || "");
        setBio(user.bio || "");
        setTelephone(user.telephone || "");
        checkProfileCompletion(user);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const checkProfileCompletion = (user) => {
    const isProfileComplete =
      user.displayName && user.bio && user.telephone;
    setProfileComplete(isProfileComplete);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const bio = bioRef.current.value;
    const telephone = telRef.current.value;

    fetch(`https://crudcrud.com/api/340512f732ef4d9daa7e276334a81198/profile`, {
      method: "POST",
      body: JSON.stringify({
        displayName: name,
        bio: bio,
        telephone: telephone,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        checkProfileCompletion(data);
        localStorage.setItem(
          "profileData",
          JSON.stringify({
            displayName: data.displayName,
            bio: data.bio,
            telephone: data.telephone,
          })
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <>
      <header>
        <h3>
          {profileComplete ? (
            <i style={{ float: "right" }}>
              Your profile is complete!{" "}
              <Link to="#">Update now if needed</Link>
            </i>
          ) : (
            <i style={{ float: "right" }}>
              Your profile is 65% complete{" "}
              <Link to="#">Complete now 100%</Link>
            </i>
          )}
        </h3>
      </header>
      <div className="detail">
        <form onSubmit={submitHandler} className="pro">
          <h2>Contact Details</h2>
          <label>Full Name:</label>
          <input type="text" ref={nameRef} defaultValue={getName} />
          <label>Bio:</label>
          <input type="text" ref={bioRef} defaultValue={getBio} />
          <label>Telephone Number:</label>
          <input type="tel" ref={telRef} defaultValue={getTelephone} />
          <br />
          <button className="btn" onClick={submitHandler}>
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;

