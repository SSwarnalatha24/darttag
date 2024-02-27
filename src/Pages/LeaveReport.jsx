import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import Table from 'react-bootstrap/Table';
import Table from './Table';

function App() {
  const [allItems, setAllItems] = useState([]);
  const [totalLeaves, setTotalLeaves] = useState([]);
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  const [activeuser, setActiveuser] = useState("");
  const [activeuserRole, setActiveUserRole] = useState("");
  const getData = () => [
    axios
      .get(`http://localhost:4000/api/allLeave/${storedUser.email}`)
      .then((response) => {
        console.log("response", response.data);
        return setAllItems(response.data);
      })
      .catch((error) => {
        console.error('Error  fetching cart items:', error);
      })


  ];
  //to get all emp leave
  const getallData = () => [
    axios
      .get('http://localhost:4000/api/EmpLeave')
      .then((response) => {
        console.log("response", response.data);
        return setAllItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);

      })
  ];
  const gettotalleaves = () => [
    axios
      .get(`http://localhost:4000/api/totalempleaves/${storedUser.email}`)
      .then((response) => {
        console.log("Leave Response", response.data);
        return setTotalLeaves(response.data);
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
          gettotalleaves();
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


  const getOneUserData = (selectedUser) => [
    axios
      .get(`http://localhost:4000/api/allLeave/${selectedUser}`)
      .then((response) => {
        console.log("response", response.data);
        return setAllItems(response.data);
      })
      .catch((error) => {
        console.error('Error  fetching cart items:', error);
      })


  ];
  const formatDate = (time) => {
    return time ? new Date(time).toLocaleDateString() : '---';
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        // accessor: "name", 
        accessor: (row) => {
          return < div >
            <span onClick={e => getOneUserData(row.email)}>{row.name}</span>
          </div >
        },
      },
      {
        Header: "Leave Type",
        accessor: "leaveType"
      },
      {
        Header: "Start Date",
        // accessor: "date",
        accessor: (row) => {
          return formatDate(row.startDate)
        }
      },
      {
        Header: "End Date",
        // accessor: "date",
        accessor: (row) => {
          return formatDate(row.endDate)
        }
      },
      {
        Header: "Applied On",
        // accessor: "appliedon",
        accessor: (row) => {
          return formatDate(row.appliedon)
        }
      },
      
      {
        Header: "Days",
        accessor: "numberofdays",
      },
      {
        Header: "Attachment",
        accessor: "attach",
      },
      
      
    ],
    []
  );
  //const buttonToHide = activeuserRole === "Admin" ? { hiddenbutton: ['Go to apply Leave'] } : "";
  return (
    <>
      <div className="row">
        <div className="col-md-10 bg-white">
          <h1 className="text-black">Hello {activeuser}!</h1>

        </div>
        <div className='col-md-2 bg-white'>
          <button
            type="button"
            className="bg-green-500 text-white text-center px-4 py-2 mt-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            <a href="#/Cart/" className="text-white">Apply Leave</a>
          </button>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-1'></div>
        <div className='col-md-10'>

          <div className='card'>

            <div className='card-hearder px-3 pt-3 d-flex justify-content-between align-items-center'>
              <h3>Leave Report</h3>

              <h6 className='text-black px-7'>Total Leaves {totalLeaves.length > 0 ? totalLeaves[0].totalleavesavailable : "12"} days</h6>

              <h6 className='text-black px-7'>Total Leaves Taken {totalLeaves.length > 0 ? totalLeaves[0].totalleavestaken : "0"} days</h6>
              <h6 className='text-black px-7'>Total Leaves Remaining {totalLeaves.length > 0 ? parseInt(totalLeaves[0].totalleavesavailable - totalLeaves[0].totalleavestaken) : "0"} days</h6>

              {activeuserRole == "Admin" ? (
                <h3>Admin User</h3>
              ) : (<></>)
              }
            </div>
            <div className='card-body'>
              <Table columns={columns} data={allItems} />
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