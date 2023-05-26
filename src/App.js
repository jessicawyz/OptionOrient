//import { useState } from 'react'
import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css"
import Favourites from "./components/Favourites";
import History from "./components/History";
import SideNav from "./components/SideNav";
import TopNav from "./components/TopNav";
import Layout from "./pages/Layout";
import Decide from "./pages/Decide";
import NotFound from "./pages/NotFound";


function App() {
  return (
    <BrowserRouter>
      {/*base layout with title*/}
      <Routes>
          <Route path="/" element={<Layout />}>
          {/*all other pages*/}
          {/*Home*/}
          <Route index element={
            <div className="Home">
              <header>
              </header>

              <main>
                <div className='container'>
                  <SideNav />
                  <Favourites />
                  <History />
                  <TopNav />
                </div>
                {/*will add image later*/}
                <div className="corner"></div>
              </main>
            </div>
          } />
          {/*decide page*/}
          <Route path="/decide" element={<Decide />} />
          <Route path="/notFound" element={<NotFound />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;