import React, { useState } from "react";
import "./App.css"
import "./styles.css"
import "./datatables.min.css"
import "bootstrap/dist/css/bootstrap.min.css";

import { Routes, Route, HashRouter } from "react-router-dom";
import Login from "./Pages/Login";
import Navebar from "./Pages/Navbar";
import Menu from "./Pages/Menu";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import LeaveReport from "./Pages/LeaveReport";
import Listofholiday from "./Pages/Listofholiday";
import Holiday from "./Pages/Holiday";
import Permission from "./Pages/Permission";
import PermissionReport from "./Pages/PermissionReport";



function App() { 
  return (
    <HashRouter>
      <Navebar /> 
        
          <Routes>
            <Route path="/" exact element={<Login />} />
            <Route path="/Home" exact element={<Home />} />
            <Route path="/Signup" exact element={<Signup />} />
            <Route path="/Login" element={<Login />}/>
            <Route path="/Attendence" element={<Menu />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/LeaveReport" element={<LeaveReport />} />
            <Route path="/Holiday" element={<Holiday />}/>
            <Route path="/Listofholiday" element={<Listofholiday />} />
            <Route path="/Permission" element={<Permission />} />
            <Route path="/PermissionReport" element={<PermissionReport />} />
          </Routes>
       
    </HashRouter>
  );
}

export default App;
//<Route path="/Cart" element={<Cart />} />