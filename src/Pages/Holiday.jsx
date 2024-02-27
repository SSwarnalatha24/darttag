import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
function Holiday() {
    const [nameofholidays, setNameofHolidays] = useState([]);
    const [holidaydate, setHolidayDate] = useState([]);
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const AddHoliday = () => {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        const selectedDay = weekday[new Date(holidaydate).getDay()];
        console.log("selected Day", selectedDay)
        const data={
            holidayDate:holidaydate,
            day:selectedDay,
            nameOfHolidays:nameofholidays,
        }
        console.log("holiday data",data);
        
      axios.post('http://localhost:4000/api/addholidays', data)
        .then(response => {
          console.log(' add holidays:', response.data);
          toast.success("holiday added successfully");
        })
        .catch(error => {
            console.log("error.response.message", error.response.data.message);
            toast.error("something error");
        })

    }
    return (
        <>
            <ToastContainer position="bottom-right" theme="dark" draggable autoClose={5000} />
            <center>
                <div className=" max-w-md mx-auto p-2 flex items-center justify-center">
                    <div class="card">
                        <div class="card-header">
                            <h2>Holidays</h2>
                        </div>
                        <br />
                        <div class="card-body">
                            <form
                                className="px-8" >
                                <div className='mb-3'>
                                    <label className='d-flex'>Date</label>
                                    <input
                                        className='form-control ' required
                                        type="date" value={holidaydate} onChange={(e) => setHolidayDate(e.target.value)}
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label className='d-flex'>Name of Holiday</label>
                                    <input
                                        className='form-control' type='text'
                                        value={nameofholidays} onChange={(e) => setNameofHolidays(e.target.value)}
                                    />
                                </div>
                                <div className='mb-3'>
                                    <button type='button' className='bg-green-500 text-white text-center px-4 py-2 mt-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
                                        onClick={AddHoliday} >Add Holiday</button>
                                        
                                </div>
                                <br />
                            </form>
                        </div>
                    </div>

                </div>
            </center>
        </>
    );
};

export default Holiday;