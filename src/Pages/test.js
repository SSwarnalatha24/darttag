import React, { useState, useEffect } from 'react';

const App = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [totalBreakTime, setTotalBreakTime] = useState(0);

  const handleClockInOut = () => {
    if (isClockedIn) {
      // Clock Out
      setIsOnBreak(false);
      setStartTime(null);
      setBreakStartTime(null);
      setTotalBreakTime(0);
    } else {
      // Clock In
      setStartTime(new Date());
    }
    setIsClockedIn(!isClockedIn);
  };

  const handleBreakStartStop = () => {
    if (isOnBreak) {
      // End Break
      const breakEndTime = new Date();
      const breakDuration = breakEndTime - breakStartTime;
      setTotalBreakTime(totalBreakTime + breakDuration);
    } else {
      // Start Break
      setBreakStartTime(new Date());
    }
    setIsOnBreak(!isOnBreak);
  };

  const formatTime = (time) => {
    return time ? new Date(time).toLocaleTimeString() : '---';
  };

  useEffect(() => {
    // Update UI or send data to server when state changes
    console.log('State updated:', { isClockedIn, isOnBreak, startTime, breakStartTime, totalBreakTime });
  }, [isClockedIn, isOnBreak, startTime, breakStartTime, totalBreakTime]);

  return (
    <div>
      <h1>Time Tracker</h1>
      <div>
        <p>Status: {isClockedIn ? 'Clocked In' : 'Clocked Out'}</p>
        <p>Start Time: {formatTime(startTime)}</p>
        <p>
          Break Status: {isOnBreak ? 'On Break' : 'Not on Break'}{' '}
          {isOnBreak ? ($ { Math.floor(totalBreakTime / 1000 / 60)} minutes) : ''}
        </p>
        <p>Break Start Time: {formatTime(breakStartTime)}</p>
      </div>
      <button onClick={handleClockInOut}>
        {isClockedIn ? 'Clock Out' : 'Clock In'}
      </button>
      <button onClick={handleBreakStartStop}>
        {isOnBreak ? 'End Break' : 'Start Break'}
      </button>
    </div>
  );
};

export default App;