import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';
function PermissionReport() {
  const [permissions, setPermissions] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [activeuser, setActiveuser] = useState("");
  const [activeuserRole, setActiveUserRole] = useState("");
  useEffect(() => {
    // Fetch permission data from the server
    axios.get('/api/permissions')
      .then(response => {
        setPermissions(response.data);
      })
      .catch(error => {
        console.error('Error fetching permissions:', error);
      });
  }, []);
  const formatTime = (time) => {
    return time ? new Date(time).toLocaleDateString() : '---';
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        // accessor: "name", 
        accessor: "name",
      },
      {
        Header: "Reason",
        accessor: "reason"
      },
      {
        Header: "From Time",
        // accessor: "date",
        accessor: (row) => {
          return formatTime(row.fromTime)
        }
      },
      {
        Header: "End Time",
        // accessor: "date",
        accessor: (row) => {
          return formatTime(row.endTime)
        }
      },
      {
        Header: "Duration",
        // accessor: "appliedon",
        accessor: (row) => {
          return formatTime(row.duration)
        }
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
            <a href="#/Permission/" className="text-white">Apply Permission</a>
          </button>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-1'></div>
        <div className='col-md-10'>

          <div className='card'>

            <div className='card-hearder px-3 pt-3 d-flex justify-content-between align-items-center'>
              <h3>Permission Report</h3>

              
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
export default PermissionReport;
