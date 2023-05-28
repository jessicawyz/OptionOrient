import React from 'react';

import Favourites from "../components/Favourites";
import History from "../components/History";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";

export default function Home() {
    return (
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
    )
}