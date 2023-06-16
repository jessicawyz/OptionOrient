import { Outlet, Link } from "react-router-dom";
import React from 'react';



export default function Layout() {
    return (
        <>
            <Link to="/home" className="name">Option <br />Orient</Link>

            <Outlet />
        </>
    )
}