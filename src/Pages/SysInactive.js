// useInactivity.js
import { useEffect, useState } from 'react';

// const useInactivity = (timeout = 10000) => {
//   const [inactive, setInactive] = useState(false);
//   const [breakDuration, setBreakDuration] = useState(0);
//   const [lastActivity, setLastActivity] = useState(new Date());

//   useEffect(() => {
//     let timeoutId;

//     const resetTimeout = () => {
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }

//       timeoutId = setTimeout(() => setInactive(true), timeout);
//     };

//     const handleActivity = () => {
//       const now = new Date();
//       setBreakDuration((prevDuration) => prevDuration + (now - lastActivity));
//       setLastActivity(now);
//       setInactive(false);
//       resetTimeout();
//     };

//     window.addEventListener('mousemove', handleActivity);
//     window.addEventListener('keydown', handleActivity);

//     resetTimeout(); // Initialize timeout

//     return () => {
//       window.removeEventListener('mousemove', handleActivity);
//       window.removeEventListener('keydown', handleActivity);
//       clearTimeout(timeoutId);
//     };
//   }, [timeout, lastActivity]);

//   return { inactive, breakDuration };
// };


// const BreakTimer = () => {
//   const [breakDuration, setBreakDuration] = useState(0);
//   const [isActive, setIsActive] = useState(true);
//   useEffect(() => {
//     let timeoutId;
//     const handleActivity = () => {
//       console.log("handlyinactivity",isActive,breakDuration);
//       setIsActive(true);
//       clearTimeout(timeoutId);

//       timeoutId = setTimeout(() => {
//         setIsActive(false);
//         setBreakDuration((prevDuration) => prevDuration + 1);
//       }, 5000);
//     }
//     window.addEventListener('mousemove', handleActivity);
//     window.addEventListener('keypress', handleActivity);
//     // window.addEventListener('blur', handleActivity);
//     // window.addEventListener('click', handleActivity);

//     return () => {
//       window.addEventListener('mousemove', handleActivity);
//       window.addEventListener('keypress', handleActivity);
//       // window.addEventListener('blur', handleActivity);
//       // window.addEventListener('click', handleActivity);
//       clearTimeout(timeoutId);
//     }
//   }, [isActive,breakDuration])
//   return { isActive, breakDuration };
// }

// export default BreakTimer;

const InactivityTracker = () => {
  const [isActive, setIsActive] = useState(true);
  const [breakStart, setBreakStart] = useState(null);
  const [breakDuration, setBreakDuration] = useState(0);

  useEffect(() => {
    const handleActivity = () => {
      if (!isActive) {
        const now = new Date();
        const elapsed = now - breakStart;
        setBreakDuration((prevDuration) => prevDuration + elapsed);
        setBreakStart(null);
      }
      setIsActive(true);
    };

    const handleInactivity = () => {
      if (isActive) {
        setBreakStart(new Date());
      }
      setIsActive(false);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('blur', handleInactivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('blur', handleInactivity);
    };
  }, [isActive, breakStart]);

  return { isActive, breakStart }
  return (
    
    <div>
      {isActive ? (
        <p>You are active!</p>
      ) : (
        <p>
          You have been inactive for a while. Break duration: {breakDuration / 5000} minutes.
        </p>
      )}
    </div>
  );
};

export default InactivityTracker;
