import { Link, useNavigate } from "react-router-dom";
import React from 'react';

export default function SideNav() {
    const navigate = useNavigate();
    return (
        <div className="sideNav">
              <div className="nav">Home</div>
              <Link to="/notFound" className="nav"><div className="nav">Forum</div></Link>
              <Link to="/notFound" className="nav"><div className="nav">Friends</div></Link>
              <Link to="/notFound" className="nav"><div className="nav">Chats</div></Link>
              <button className='decide' onClick={() => navigate('/decide')}>Decide!</button>
          </div>

    )
}