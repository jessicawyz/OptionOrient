import { Link } from "react-router-dom";
import React from 'react';


export default function NotFound() {
    return (
        <>
            <h1 className="nfText">OOPS! This page is incomplete!</h1>
            <p className='nfText'>return to <Link to="/home" className="links">home page</Link></p>
        </>
    )
}