import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';
function App() {
    const [allholiday, setAllholiday] = useState([]);
    const [hidden, setHidden] = useState(false);
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const [activeuser, setActiveuser] = useState([]);
    const [activeuserRole, setActiveUserRole] = useState([]);

    const getData = () => [
        axios
            .get(`http://localhost:4000/api/holiday`)
            .then((response) => {
                console.log("holiday response", response.data);
                return setAllholiday(response.data)
            })
            .catch((error) => {
                console.error("Error fetching in Holiday added",error)
            })
    ];

    useEffect(() => {
        console.log("works", storedUser)
        if (storedUser) {
            axios
                .get("http://localhost:4000/api/activeuser", {
                    params: { userEmail: storedUser.email }
                })
                .then((response) => {
                    console.log("current user", response.data);
                    const username = response.data.username;
                    console.log(username);
                    setActiveuser(username);
                    const currentuserrole = response.data.userRole;
                    setActiveUserRole(currentuserrole);
                    getData()
                })
                .catch((err) => {
                    console.log("user not found", err)
                })
        }
    }, [])
    
    const formatDate = (time) => {
        return time ? new Date(time).toLocaleDateString() : '---';
    };
    const columns = React.useMemo(() => [
        {
            Header: "date",
            accessor:  (row) => {
                return formatDate(row.holidayDate)
              }
        },
        {
            Header: "day",
            accessor: "day"
        },
        {
            Header: "holidays",
            accessor: "nameOfHolidays",
        }
    ],
        [],
    );
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
                        <a href="#/Holiday/" className="text-white">Add holiday</a>
                    </button>
                    
                </div>
            </div>
            <div className='row'>
                <div className='col-md-1'></div>
                <div className='col-md-10'>

                    <div className='card'>

                        <div className='card-hearder px-3 pt-3 d-flex justify-content-between align-items-center'>
                            <h3>list of holidays</h3>



                        </div>
                        <div className='card-body'>
                            <Table columns={columns} data={allholiday} />
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

