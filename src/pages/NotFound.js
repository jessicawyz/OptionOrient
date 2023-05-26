import { Link } from "react-router-dom";
import React from 'react';


export default function NotFound() {
    return (
        <>
            <h1>OOPS! This page is incomplete!</h1>
            <p>return to <Link to="/" className="links">home page</Link></p>
        </>
    )
}