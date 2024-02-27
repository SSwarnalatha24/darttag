import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  function handleNewAccount(event) {
    event.preventDefault();
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

    
    // Send POST request to create a new user
    axios
      .post("http://localhost:4000/api/login", {
        email: email,
        password: password
      })
      .then((response) => {
        // Handle the response from the server here
        if (response.data && response.data.success) {

          setIsLoggedIn(true);
          toast.success("Login Successfully");
          // Create a user object with email and balance
          const user = { email,password };

          // Store the user object in localStorage
          sessionStorage.setItem('user', JSON.stringify(user));
          setTimeout(() => {
            // window.location.reload();
            window.location.href= "/#Attendence";
          }, 1000); // Adjust the delay as needed

        } else {
          toast.error("An error occurred while logging in");
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        toast.error("Invalid Email or Password");
      });

    

  }
  const isFormValid = email && password;

  return (
    <>
      <ToastContainer position="bottom-right" theme="dark" draggable autoClose={5000} />

      <center>

        <form onSubmit={handleNewAccount}
          className="bg-black shadow-md rounded-half px-8 pt-6 pb-8 m-4 " >
          {/* <p className="log-info text-gray-400">
            Don't have an account yet ? <Link
              to="/signup"
              className=" text-violet-600 block md:inline-block"
              title="Home"
            >
              Sign Up</Link></p> */}
              <p className="log-info text-gray-400 fs-3">Login</p>
          <input
            className="border-bottom text-black w-full border-gray-300 px-4 py-2  placeholder-gray-400"
            type="email"
            id="email"
            value={email}
            placeholder="Email"
            onChange={(event) => setEmail(event.target.value)}
            required autoComplete="off"
          />

          <br />
          <br />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="off"
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
          <button
            type="submit"
            onClick={handleNewAccount}
            disabled={!isFormValid}
            className="bg-amber-950 text-white text-center px-4 py-2 rounded-lg disabled:bg-violet-499"
          >
            Login
          </button>

          <br />
        </form>

        
      </center>
    </>
  );
}
