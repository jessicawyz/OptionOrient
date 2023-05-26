import { Outlet, Link } from "react-router-dom";
import React from 'react';


export default function Layout() {
    return (
        <>
            <Link to="/" className="name">Option <br />Orient</Link>

            <Outlet />
        </>
    )
}