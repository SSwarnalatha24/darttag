import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import axios from "axios";
import Container from 'react-bootstrap/Container';
import logo1 from "./darttag.jpg"; 

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Navebar() {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const [activeuser, setActiveuser] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [WorkendTime, setEndTime] = useState(null);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState(0);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [employeeId, setEmployeeId] = useState(0);
  const [onClose, setOnClose] = useState(0);
  const [ItemsTostore, setItemsToStore] = useState([]);


  const [loading, setLoading] = useState(false);

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

  const handleLogout = () => {
    // Show loading animation
    setLoading(true);

    // Remove user data from sessionStorage
    sessionStorage.removeItem("user");

    // Reload the page after a short delay (for the animation to be visible)
    setTimeout(() => {
      window.location.reload();
      window.location.href = "/login";
    }, 1000); // Adjust the delay as needed
  };




  useEffect(() => {
    console.log("storedUser has changed:", storedUser);
  }, [storedUser]);
  const handleClockInOut = () => {
    if (isClockedIn) {
      // Clock Out
      setIsOnBreak(false);
      setStartTime(null);
      setBreakStartTime(null);
      setTotalBreakTime(0);
      // const EndTime = new Date();
      // setEndTime(EndTime);
      // const workDuration = EndTime - startTime;
      // setTotalWorkTime(totalWorkTime + workDuration);
      setTimeout(() => {
        // UpdateAttendence(UpdateValues)
        getTodayAttendence();
      }, 2000);
    } else {
      // Clock In
      const graceStarttime = new Date().setHours(9, 0, 0);
      const graceEndtime = new Date().setHours(9, 15, 0)
      //setStartTime(new Date());
      const WorkstartTime = new Date();
      let islatelogin;
      //const WorkstartTime = new Date();
      console.log("work starttime", WorkstartTime);
      // const UpdatedValues = { WorkstartTime, WorkendTime, totalBreakTime, totalWorkTime,islatelogin };
      // console.log("UpdatedValues", UpdatedValues);

      if (WorkstartTime >= graceStarttime && WorkstartTime <= graceEndtime) {
        console.log("employee in late login", { islatelogin: "N" });
        islatelogin = "N"
      } else {
        console.log("employee in late login", { islatelogin: "y" });
        islatelogin = "Y"
      }

      const UpdatedValues = { WorkstartTime, WorkendTime, totalBreakTime, totalWorkTime, islatelogin };
      console.log("UpdatedValues", UpdatedValues);

      setTimeout(() => {
        AttendanceLog(UpdatedValues);
      }, 2000);

    }
    setIsClockedIn(!isClockedIn);
  };
  useEffect(() => {
    // Update UI or send data to server when state changes
    console.log('State updated:', { isClockedIn, isOnBreak, startTime, WorkendTime, breakStartTime, totalBreakTime, totalWorkTime });

    // setItemsToStore({startTime, WorkendTime, totalBreakTime, totalWorkTime });
  }, [isClockedIn]);
  const handleBreakStartStop = () => {
    if (isOnBreak) {
      // End Break
      const breakEndTime = new Date();
      const breakDuration = breakEndTime - breakStartTime;
      setTotalBreakTime(totalBreakTime + breakDuration);

      const totalBreakDuration = Math.floor(breakDuration / 1000 / 60) + " minutes"

      console.log("total break time", { breakDuration, totalBreakDuration })
    } else {
      // Start Break
      setBreakStartTime(new Date());
    }
    setIsOnBreak(!isOnBreak);
  };

  const formatTime = (time) => {
    return time ? new Date(time).toLocaleTimeString() : '---';
  };




  const AttendanceLog = (item) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser && storedUser.email) {
      const data = {
        ...item, email: storedUser.email
      };
      axios.post('http://localhost:4000/api/attendenceLog', data)
        .then(response => {
          console.log('user clocked in:', response.data);
          if (response.data.message === "Attendence logged in system but late login") {
            toast.success("you are clocked in lately");
          } else if (response.data.message === "Attendence logged in system with status absent") {
            toast.success("you are clocked in lately So Marked as Absent")
          } else if (response.data.message === "Attendence logged in system") {
            toast.success("Clocked in Successfully");
          }
        })
        .catch(error => {
          console.log("error.response.message", error.response.data.message);
          if (error.response.data.message === "Record already exists for today") {
            toast.error("user alreaded clocked in today")
          } else {
            toast.error("somthing error");
            console.error('Error adding attendence to Syatem:', error);
          }
        });
    } else {
      console.error('User not found in session storage');
    }
  };


  const getTodayAttendence = () => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    axios
      .get(`http://localhost:4000/api/singleAttendence/${storedUser.email}`)
      .then((response) => {
        console.log("response", response.data);
        const realstartTime = new Date(response.data[0].clockInTime);
        const updateID = response.data[0]._id;
        const EndTime = new Date();
        setEndTime(EndTime);
        const workDuration = EndTime - realstartTime;
        console.log("workDuration", workDuration);
        const totalWorkDuration = totalWorkTime + workDuration;
        setTotalWorkTime(totalWorkTime + workDuration);

        setTimeout(() => {
          const UpdateValues = { updateID, realstartTime, EndTime, totalBreakTime, totalWorkDuration }
          console.log("UpdateValues", UpdateValues);
          UpdateAttendence(UpdateValues);
        }, 2000);

        // 
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
      })
  }

  const UpdateAttendence = (item) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser && storedUser.email) {
      const data = {
        ...item,
        email: storedUser.email
      };
      console.log("data", data);
      axios.post(`http://localhost:4000/api/updateAttendence/${data.updateID}`, data)
        .then(response => {
          console.log('user clocked out:', response.data);
          toast.success("Clocked out Successfully");
        })
        .catch(error => {
          console.error('Error update attendence to Syatem:', error);
          if (error.response.data.message === "Record already Clocked out for today") {
            toast.error("user alreaded clocked out today")
          } else {
            toast.error("somthing error");
            console.error('Error adding attendence to Syatem:', error);
          }
        });
    } else {
      console.error('User not found in session storage');
    }
  };



  return (
    <>
      <ToastContainer position="bottom-right" theme="dark" draggable autoClose={5000} />
      <header>
        <Navbar bg="blue " variant="dark" expand="lg" className="p-3">
          <div className="container">
            {/* <Link to="/" className="navbar-brand">
              <h4 className=" text-yellow-500 text-2xl">Employee Attendance</h4>
            </Link> */}
            <Navbar.Brand href="#/home">
            
           
          <img
            src={logo1}
            width="50"
            height="50"
            className="d-inline-block "
            alt="Your Logo"
            
          />
       
        
        </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
            <h4 className=" text-yellow-500 text-2xl">Employee Attendance</h4>
              <Nav className="m-auto ">
            

                {/* <Link to="home" className="nav-link ">
                Home <i className="bi bi-house-door"></i>
                </Link> */}

                {storedUser ? (
                  <>
                    <Link to="Attendence" className="nav-link">
                      Attendence  <i className="bi bi-arrow-down"></i>
                    </Link>
                    <Link to="/LeaveReport" className="nav-link">
                      Leave  <i class="bi bi-arrow-down"></i>
                    </Link>
                    <Link to="/Listofholiday" className="nav-link">
                      Holidays  <i class="bi bi-arrow-down"></i>
                    </Link>
                    {/* <Link to="/Permission" className="nav-link">
                      Permission  <i class="bi bi-arrow-down"></i>
                    </Link> */}
                    <Link to="/PermissionReport" className="nav-link">
                      Permission Report  <i class="bi bi-arrow-down"></i>
                    </Link>

                  </>

                ) : (
                  <></>
                  // <Link to="signup" className="nav-link">
                  //   Signup <i class="bi bi-person-circle"></i>
                  // </Link>
                )}
              </Nav>


              <Nav>

                {storedUser ? (
                  <>
                    {loading ? (
                      <div className="loading-animation">
                        loading..
                      </div>
                    ) : (
                      <button className="ml-2 p-2 text-white bg-violet-900" onClick={handleClockInOut}>
                        {isClockedIn ? 'Clock Out' : 'Clock In'}
                      </button>
                    )}
                  </>
                ) : (<p></p>)}
              </Nav>
              <Nav>
                {storedUser && isClockedIn ? (

                  <button className="ml-2 p-2 text-white bg-violet-900" onClick={handleBreakStartStop}>
                    {isOnBreak ? 'End Break' : 'Start Break'}
                  </button>
                ) : (<></>)}

              </Nav>
              <Nav>

                {storedUser ? (
                  <>
                    {loading ? (
                      <div className="loading-animation">
                        Loading...
                      </div>
                    ) : (
                      <button
                        onClick={handleLogout}
                        className="ml-2 p-2 text-white bg-violet-900"
                      >
                        Logout <i className="bi bi-box-arrow-left"></i>
                      </button>
                    )}
                  </>
                ) : (
                  <Link to="/login" className="nav-link">
                    Login <i className="bi bi-box-arrow-right"></i>
                  </Link>
                )}
              </Nav>
            </Navbar.Collapse>

          </div>
        </Navbar>
      </header>
    </>
  );
};
