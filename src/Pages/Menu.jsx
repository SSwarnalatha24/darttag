import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import Table from 'react-bootstrap/Table';
import Table from './Table';

function App() {
  const [allItems, setAllItems] = useState([]);
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const [activeuser, setActiveuser] = useState("");
  const [activeuserRole, setActiveUserRole] = useState("");
  const getData = () => [
    axios
      .get(`http://localhost:4000/api/allAttendence/${storedUser.email}`)
      .then((response) => {
        console.log("response", response.data);
        return setAllItems(response.data);
      })
      .catch((error) => {
        console.error('Error  fetching cart items:', error);
      })


  ];
  // to get allempAttend
  const getallData = () => [
    axios
      .get('http://localhost:4000/api/allEmpAttend')
      .then((response) => {
        console.log("response", response.data);
        return setAllItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);

      })
  ]; 

  useEffect(() => {
    if (storedUser) {
      // Send the stored user data to the server to determine role
      axios
        .get("http://localhost:4000/api/activeuser", {
          params: { userEmail: storedUser.email }
        })
        .then((response) => {
          console.log("current user", response.data);
          const username = response.data.username;
          console.log(username)// Extract the username from the response
          setActiveuser(username); // Set activeuser to the extracted username
          const currentuserrole = response.data.userRole;
          setActiveUserRole(currentuserrole);
          if (currentuserrole == 'Admin') {
            getallData();
            console.log("current user", response.data.userRole);
          } else if (currentuserrole == 'Employee') {
            getData();
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const formatDate = (time) => {
    return time ? new Date(time).toLocaleDateString() : '---';
  };
  const formatTime = (time) => {
    return time ? new Date(time).toLocaleTimeString() : '---';
  };
  const convertSeconds = (milliseconds) => {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    hours = hours % 24;

    if (hours > 0) {
      return `${hours} hours : ${minutes} minutes`
    } else {
      return `${minutes} minutes`
    }
  }
  const getOneUserData = (selectedUser) => [
    axios
      .get(`http://localhost:4000/api/allAttendence/${selectedUser}`)
      .then((response) => {
        console.log("response", response.data);
        return setAllItems(response.data);
      })
      .catch((error) => {
        console.error('Error  fetching cart items:', error);
      })


  ];

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        // accessor: "name", 
        accessor: (row) => {
          return < div  >
            <span  onClick={e => getOneUserData(row.email)}>{ row.name}</span>
          </div >
        },
      },
      {
        Header: "Date",
        // accessor: "date",
        accessor: (row) => {
          return formatDate(row.date)
        }
      },
      {
        Header: "Status",
        accessor: "AttendenceStatus",
      }, 
      
      {
        Header: "In Time",
        // accessor: "clockInTime", 
        accessor: (row) => {
          console.log("time,",new Date(row.clockInTime).getHours(),new Date(row.clockInTime).getMinutes(),new Date(row.clockInTime).getHours() > 9 && new Date(row.clockInTime).getMinutes() > 15);
          if (new Date(row.clockInTime).getHours() >= 9 && new Date(row.clockInTime).getMinutes() > 15) {
            return <div className='text-danger' >{formatTime(row.clockInTime)}</div>
          } else {
            return formatTime(row.clockInTime)
          }
        }
      },
      {
        Header: "Out Time",
        // accessor: "clockOutTime",
        accessor: (row) => {
          return formatTime(row.clockOutTime)
        }
      },
      {
        Header: "Work Duration",
        // accessor: "totalWorkDuration",
        accessor: (row) => {

          return convertSeconds(row.totalWorkDuration)
        }
      },
      {
        Header: "Break Duration",
        accessor: "totalBreakDuration"
      },
      // {
      //   Header:"Active status",
      //   accessor:"active"
      // }
    ],
    []
  );
  const ColumnToHide = activeuserRole === "Employee" ? { hiddenColumns: ['name'] } : "";

  return (
    <>
      <div className="row">
        <div className="col-md-12 bg-white">
          <h1 className="text-black">Hello {activeuser}!</h1>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-1'></div>
        <div className='col-md-10'>
          <div className='card'>
            <div className='card-hearder px-3 pt-3 d-flex justify-content-between align-items-center'>
              <h3>Attendence</h3>
              {activeuserRole == "Admin" ? (
                <h3>Admin User</h3>
              ) : (<></>)
              }
            </div>
            <div className='card-body'>
              <Table columns={columns} data={allItems} initialState={ColumnToHide} />
            </div>
          </div>

        </div>
        <div className='col-md-1'>

        </div>
      </div>
    </>
  );
}

export default App;