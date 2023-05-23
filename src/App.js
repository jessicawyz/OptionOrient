//import { useState } from 'react'
import "./style.css"

function App() {
  return (
    <div className="App">
      <header>
        <p className="name">Option <br></br>Orient</p>
      </header>

      <main>
        <div className='container'>
          <div className="sideNav">
              <div className="nav">Home</div>
              <div className="nav">Forum</div>
              <div className="nav">Friends</div>
              <div className="nav">Chats</div>
              <button className='decide'>Decide!</button>
          </div>
          <div className="favourites">Favourites</div>
          <div className="history">History</div>
          <div className="topNav">
            <div className="login">Login</div>
            <div className="register">Register</div>
            <div className="circle"></div>
          </div>
        </div>
        {/*will add image later*/}
        <div className="corner"></div>
      </main>
    </div>
  );
}

export default App;