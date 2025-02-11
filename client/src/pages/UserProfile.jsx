import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from 'axios';

const UserProfile = () => {
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const { currentUser } = useContext(UserContext);
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();
  const token = currentUser?.token;
  //redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer  ${token}` },
          }
        );
        const { name, email, avatar } = response.data;
        setName(name);
        setEmail(email);
        setAvatar(avatar);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.set('avatar', avatar);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/change-avatar`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setAvatar(response?.data.avatar);
    } catch (err) {
      console.log(err);
    }
  };

  const updateUserDetail = async (e) => {
    e.preventDefault();
    try {
      const userData = new FormData();
      userData.set('name',name);
      userData.set('email',email);
      userData.set('currentPassword',currentPassword);
      userData.set('newPassword',newPassword);
      userData.set('newConfirmPassword',newConfirmPassword);
    
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`,userData,
      {withCredentials:true,headers:{Authorization:`Bearer ${token}`}})

      if (response.status == 200) {
        navigate('/logout');
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={`/myposts/${currentUser.id}`} className="btn">
          My posts
        </Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img
                src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`}
                alt=""
              />
            </div>
            {/* {Form to update avatar} */}
            <form className="avatar__form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
                accept="png,jpg,jpeg"
              />
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}>
                <FaEdit />
              </label>
            </form>

            {isAvatarTouched && (
              <button
                className="profile__avatar-btn"
                onClick={changeAvatarHandler}
              >
                <FaCheck />
              </button>
            )}
          </div>
          <h1>{currentUser?.name}</h1>
          {/* form to update user detail */}
          <form className="form profile__form" onSubmit={updateUserDetail}>
            {error && <p className="form__error-message">{error}</p>}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={newConfirmPassword}
              onChange={(e) => setNewConfirmPassword(e.target.value)}
            />
            <button type="submit" className="btn primary">
              Update details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
