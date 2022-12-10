const fetch = require("node-fetch");
const { reset } = require("nodemon");
const { WEB_KEY } = require("../config/constant");

exports.createFirebaseUser = async (email, password) => {
  const body = {
    email,
    password,
  };
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${WEB_KEY}`,
    {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }
  );
  const data = await response.json();
  return data;
};

exports.signInFirebaseUser = async (email, password) => {
  const body = {
    email,
    password,
  };
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${WEB_KEY}`,
    {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }
  );
  const data = await response.json();
  return data;
};

exports.passwordResetEmail = async (email) => {
  const body = {
    requestType: "PASSWORD_RESET",
    email,
  };

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${WEB_KEY}`,
    {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }
  );
  const data = await response.json();
  return data;
};

exports.userPasswordChange = async (idToken, password) => {
  const body = {
    idToken,
    password,
  };

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${WEB_KEY}`,
    {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }
  );
  const data = await response.json();
  return data;
};
