import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
function Leave() {
  //const [cartItems, setCartItems] = useState([]);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [file, setFile] = useState(null)
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [userRole, setUserRole] = useState("");
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [totalLeaves, setTotalLeaves] = useState([]);
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
 
  useEffect(() => {
    gettotalleaves();
  }, [])
  const gettotalleaves = () => [
    axios
      .get(`http://localhost:4000/api/totalempleaves/${storedUser.email}`)
      .then((response) => {
        console.log("Leave Response", response.data);
        return setTotalLeaves(response.data);
      })
      .catch((error) => {
        console.error('Error fetching leaves:', error);

      })
  ];
  const DifferentInDays = (sdate, edate) => {
    console.log("DifferentInDays works", sdate, edate);
    const diffTime = Math.abs(new Date(edate) - new Date(sdate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log("diffTime", diffTime, "diffDays", diffDays);
    return parseInt(diffDays + 1);
  }

  // Close the form
  const handleSubmit = () => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const NoofDaysApplied = DifferentInDays(startDate, endDate);
    console.log("noofdaysApplied", NoofDaysApplied);
    if (storedUser && storedUser.email)  {
      const data = {
        email: storedUser.email,
        leaveType: leaveType,
        startDate: startDate,
        endDate: endDate,
        numberofdays: NoofDaysApplied,
        reason: reason,
        attachment: attachment,
        };
      console.log(" data", data);
      axios.post('http://localhost:4000/api/applyleave', data)
        .then(response => {
          console.log('user applied leave:', response.data);
          if (totalLeaves.length > 0) {
            // Udpate  total leaves count
            const updateSickLeaveCount = leaveType === "Sick Leave" ? parseInt(totalLeaves[0].totalsickleavestaken + NoofDaysApplied) : totalLeaves[0].totalsickleavestaken;
            const updatePersonalLeaveCount = leaveType === "Personal Leave" ? parseInt(totalLeaves[0].totalperleavestaken + NoofDaysApplied) : totalLeaves[0].totalperleavestaken;
            const updateTotalLeavesTaken = parseInt(totalLeaves[0].totalleavestaken + NoofDaysApplied);
            const updateItemId = totalLeaves[0]._id
            const leaveCountData = {
              updateID: updateItemId,
              totalleavestaken: updateTotalLeavesTaken,
              totalsickleavestaken: updateSickLeaveCount,
              totalperleavestaken: updatePersonalLeaveCount,
              email: storedUser.email
            }
            console.log("Record to be updated", leaveCountData);
            updateLeaveCount(leaveCountData);
          } else {
            //Create total leave count
            const addSickLeaveCount = leaveType === "Sick Leave" ? NoofDaysApplied : 0;
            const addPersonalLeaveCount = leaveType === "Personal Leave" ? NoofDaysApplied : 0;
            const leaveCountData = {
              email: storedUser.email,
              totalleavestaken: NoofDaysApplied,
              totalsickleavestaken: addSickLeaveCount,
              totalperleavestaken: addPersonalLeaveCount
            }
            createLeaveCount(leaveCountData);
          }

        })
        .catch(error => {
          console.log("error.response.message", error.response.data.message);
          if (error.response.data.message === "already leave applied for the start date") {
            toast.error("already leave applied for the start date")
          } else {
            toast.error("somthing error");
            console.error('Error adding attendence to Syatem:', error);
          }
        });
    } else {
      console.error('User not found in session storage');
    }
  };
  const roles = [
    "Sick Leave",
    "Personal Leave",
    "Loss of Pay",
    "optional holiday",
    "vacational holiday"
  ];             
  // const handleAttachmentChange = (event) => {
  //   const file = event.target.files[0];
  //   setAttachment(file);
  // };                               
  const onRoleChangeHandler = (event) => {
    setLeaveType(event.target.value);
    console.log(
      "User Selected Value - ",
       event.target.value
    );
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Make a POST request to upload the file
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  const createLeaveCount = (data) => {
    axios.post('http://localhost:4000/api/addLeaveCount', data)
      .then(response => {
        console.log('user applied leave:', response.data);
        toast.success("Leave applied Successfully");
        window.location.href = "/#LeaveReport"
      })
      .catch(error => {
        toast.error("somthing error");
        console.error('Error adding leave count to System:', error);
      });
  }

  const updateLeaveCount = (data) => {
    console.log();
    axios.post(`http://localhost:4000/api/UpdateLeaveCount/${data.updateID}`, data)
      .then(response => {
        console.log('user applied leave:', response.data);
        toast.success("Leave applied Successfully");
        window.location.href = "/#LeaveReport"
      })
      .catch(error => {
        toast.error("somthing error");
        console.error('Error update leave count to System:', error);
      });
  }
  const isFormValid = leaveType && startDate && endDate && reason;
  return (

    <>
      <ToastContainer position="bottom-right" theme="dark" draggable autoClose={5000} />
      <center>
        <div className=" max-w-md mx-auto p-2 flex items-center justify-center">
          <div class="card">

            <div class="card-header">

              <h2>Leave Application</h2>
            </div>
            <br />
            <div class="card-body">
              <form
                className="px-8"
              >

                <div className='mb-3'>
                  <label className='d-flex'>Leave Type *</label>
                  <select className='form-control' required
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
                </div>
                <div className='mb-3'>
                  <label className='d-flex'>Start Date *</label>
                  <input
                    className='form-control ' required
                    type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className='mb-3'>
                  <label 
                  className='d-flex'>End Date *</label>
                  <input
                    className='form-control  text-white-100' required
                    type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className='mb-3'>
                  <label className='d-flex'>Reason</label>
                  <input
                    className='form-control' type='text'
                    value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>
                <div className='mb-3'>
                <label className='d-flex'>Attachment</label>
{/*             
            <input type="file" 
           
            value={attachment}
            onChange={(handleAttachmentChange) => setAttachment(handleAttachmentChange.target.value)} 
            accept=".pdf,.doc,.docx,.txt,image/*"
            /> */}
          <form onSubmit={handleOnSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

                </div>
                {/* <input  
        className="mb-4 shadow appearance-none border-bottom  w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"
          placeholder='End date'
          type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <br />
        
       <textarea
       className="mb-4 shadow appearance-none border-bottom  w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"
          placeholder='reason'
           value={reason} onChange={(e) => setReason(e.target.value)} />
          <br /> */}

                <br />
                <button type="button"
                  className='form-control'
                 onClick={handleSubmit}
                >Submit</button>
              </form>
            </div>
          </div>
          </div>
      </center>
    </>
    );
  };
export default Leave;