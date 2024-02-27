import React, { useState } from "react";
import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function SignUp() {

  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  // const [role, setRole] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const[onRoleChangeHandler,setOnRoleChangeHandler]=useState("");
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  function handleSignUp(event) {
    event.preventDefault();
    let nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(username)) {
      toast.error("Name can only contain alphabets")

      return;
    }
    // Validate email
    let emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid Email")
      return;
    }

    // Validate password
    let passregex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}/;
    if (password.length < 8) {
      toast.info("Enter 8 Characters")
      return;
    } else if (!passregex.test(password)) {
      toast.info("Strong Password Required")
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const newUser = {
      username: username,
      password: password,
      email: email,
      userRole: userRole,
    };


    // Perform signup logic (e.g., API call, etc.)
    axios.post('http://localhost:4000/api/newuser', { newUser })
      .then((response) => {
        // Assuming your server returns a success message, you can check it here
        if (response.data && response.data.success) {
          const user = { email, password };
          sessionStorage.setItem('user', JSON.stringify(user));
          // Set sign-up success
          toast.success("Sign Up Successfully");
          setIsSignUpSuccess(true);
          // window.location.reload();
        } else {
          // Handle unsuccessful response here, such as displaying an error message
        }

        // // Reset form values
        // setUsername('');
        // setPassword('');
      })
      .catch((error) => {
        toast.warning("Error creating user");
        setIsSignUpSuccess(false);
        console.error('Error creating user:', error);

      });

  }
  const roles = [
    "Admin",
    "Employee",

  ];
  const onRoleChangeHandler = (event) => {
    setUserRole(event.target.value);
    console.log(
      "User Selected Value - ",
      event.target.value
    );
  };
  const isFormValid = username && email && password && confirmPassword;


  return (
    <>
      <ToastContainer position="bottom-right" theme="dark" draggable autoClose={5000} />
      <center>
        <div className="max-w-md mx-auto p-2 flex items-center justify-center">
          {isSignUpSuccess ? (
            <div className="text-center">
              <p className="text-black text-2xl font-bold">Sign Up Successful</p>
              <button
                type="button"
                className="bg-green-500 text-white text-center px-4 py-2 mt-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                <a href="#/login/" className="text-white">Go to Login</a>
              </button>
            </div>
          ) : (

            <form
              className="bg-black shadow-md  px-8 pt-6 pb-8 m-4"
              onSubmit={handleSignUp}
            >
              <p className="log-info text-gray-400 fs-3">Sign up</p>
              <input
                className="mb-4 shadow appearance-none border-bottom  w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"
                id="name"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="off"
              />

              <br />
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
                required autoComplete="off"
                className="mb-4 shadow appearance-none border-bottom  w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"
              />
              <br />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required autoComplete="off"
                  className="border-bottom text-black border-gray-300 w-full px-4 py-2 placeholder-gray-400" // Added padding-right
                />
                <span
                  className="absolute right-0 top-0 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="bi bi-eye-slash text-black"></i> // Bootstrap eye-slash icon
                  ) : (
                    <i className="bi bi-eye text-black"></i> // Bootstrap eye icon
                  )}
                </span>
              </div>
              <br />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                className="text-black mb-4 shadow appearance-none border-bottom  w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"
              />

              <select className="border-bottom text-black border-gray-300 w-full px-4 py-2 placeholder-gray-400"
                onChange={onRoleChangeHandler}>
                <option>Please choose one option</option>
                {roles.map((role, index) => {
                  return (
                    <option key={index}>
                      {role}
                    </option>
                  );
                })}
              </select>

              {/* <h3>You selected: {role}</h3> */}

              <button
                type="submit"
                onClick={handleSignUp}
                disabled={!isFormValid}
                className="bg-amber-950 text-white text-center px-4 py-2 mt-4 rounded-lg hover:bg-violet-600 cursor-pointer focus:outline-none focus:bg-violet-600"
              >
                Sign Up
              </button>
            </form>
          )}
          <br />
        </div>
      </center>
    </>
  );
}
