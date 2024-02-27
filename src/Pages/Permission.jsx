import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
const PermissionForm = ({ onSubmit }) => {
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form fields
    if (!reason || !duration) {
      alert('Please fill in all fields');
      return;
    }
    // Submit form data
    onSubmit({ reason, duration });
    // Reset form fields
    setReason('');
    setDuration('');
  };
  
  return (
   
    <>
     <ToastContainer position="bottom-right" theme="dark" draggable autoClose={5000} />
      <center>
        <div className=" max-w-md mx-auto p-2 flex items-center justify-center">
          <div class="card">

            <div class="card-header">

              <h2>Permission</h2>
            </div>
            <br />
            <div class="card-body">
              <form
                className="px-8"
              >
                <div className='mb-3'>
                  <label  className='d-flex'> Date: </label>
                  <input

                    className='form-control ' required
                    type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

     <div className='mb-3'>
        <label className='d-flex'> Reason:</label>
        <input className='form-control '
          type="text"
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>
      <div className='mb-3'>
                  <label className='d-flex'>From Time: *</label>
                  <input
                    className='form-control ' required
                    type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
                </div>
                <div className='mb-3'>
                  <label 
                  className='d-flex'>To Time: *</label>
                  <input
                    className='form-control  text-white-100' required
                    type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} />
                </div>
      <div>
        <label htmlFor="duration">Duration (hours): *</label>
        <input
        className='form-control ' 
          type="number"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required 
        />
      </div> 
      <br />
      <button 
       type="submit"
       className='form-control' 
       onSubmit={handleSubmit}

        >Submit</button>
    </form>
    </div>
    </div>
    </div>
    </center>
    </>
  );
};

export default PermissionForm;