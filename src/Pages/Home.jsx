import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import axios from "axios";
//import Clock from 'react-clock';
import Clock from "./Clock";
import Calendar from 'react-calendar';
import logo1 from "./darttaghome.gif"
import BreakTimer from "./SysInactive";
export default function Home() {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const [activeuser, setActiveuser] = useState("");
  const [loading, setLoading] = useState(false);
  const {isActive,breakDuration} = BreakTimer();
  useEffect(() => {
    
    if (storedUser) {
      // Send the stored user data to the server to determine role
      axios
        .get("http://localhost:4000/api/activeuser", {
          params: { userEmail: storedUser.email }
        })
        .then((response) => {
          const username = response.data.username;
          console.log(username)// Extract the username from the response
          setActiveuser(username); // Set activeuser to the extracted username
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [storedUser]);
  
  return (
    <>
      
      {activeuser ? (<div className="active-user text-black-100 text-xxl">
        
        <span className="user-name text-yellow-400">WELCOME🎯{activeuser}</span>   
        {isActive ? (
        <p>You are active!</p>
        
      ) : (
        <p>
          You have been inactive for a while. Break duration: {breakDuration / 9000} seconds.
         
        </p>
        
      )}
      {/* Your component content */}
      </div>

      ) : null}
      
        
      
      <div >
      < Clock />
     

              <img
                class="center"
               
                src= {logo1}/>
                
                
                </div>
                <div  className="calendar-container">
        <Calendar />
      </div>
                 <footer >
    <p>&copy; 2024 Darttag. All rights reserved.</p>
  </footer>
   {/* <div class="home">
           <img
              class="homeimg"
              alt="Paris" class="center"
             src={logo1}
            />
            
          
        </div> */}
  {/* <footer>
    <p>&copy; 2024 Darttag. All rights reserved.</p>
  </footer> */}
      {/* <h1>welcome {activeuser?(
                    <span>{activeuser}</span>
                  ):null}</h1> */}
      {/* <h1>"Attendance MONITARING"</h1> */}
    </>
  )

}