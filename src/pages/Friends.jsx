import {React, useState, useEffect} from 'react';

import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import FriendList from '../components/FriendList';
import { firestore, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Friends() {
    const [user, loading] = useAuthState(auth);
    const [openSearch, setOpenSearch] = useState(false);
    const [id, setId] = useState(null);

    const [uid, setUid] = useState(null);
    useEffect(() => {
        if (user) {
            setUid(user.uid)
        }
    }, [user]);

    function handleGetID() {
        try {
            navigator.clipboard.writeText(uid);
            alert("Successfully copied UID!");
        } catch(e) {
            console.log("Error copying UID: " + e.message);
        }
    }
    async function searchId() {
        const dbRef = doc(firestore, `${id}`, "info");
        const snapShot = await getDoc(dbRef);
        if (!snapShot.exists()) {
            console.log(false);
        } else {
            console.log(true);
            console.log(snapShot);
        }
        setId(null);
        setOpenSearch(false);
    }

    
    return (
          <main>
            <div className='container-row tw-flex'>
              <SideNav />
              <div className='tw-flex-grow tw-mx-4 tw-flex tw-flex-col'>
                <div className='tw-flex tw-flex-row'>
                    <p className='tw-font-medium tw-text-3xl tw-text-white'>Friends</p>
                    <button className="tw-ml-4 tw-p-2 light" onClick={handleGetID}>Copy ID</button>
                    <button className="tw-ml-4 tw-p-2 light" onClick={() => setOpenSearch(true)}>Add a Friend</button>
                </div>
                <div className="tw-overflow-x-hidden tw-overflow-y-scroll">
                    <FriendList />
                </div>
              </div>
              <TopNav />
            </div>
          {openSearch && (
            <div className='tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-800 tw-bg-opacity-75'>
            <div className='tw-bg-white tw-p-6 tw-rounded-lg'>
              <h3 className='tw-text-lg tw-font-medium tw-mb-4'>Enter Friend ID</h3>
              <input
                value={id}
                onChange={(event) => setId(event.target.value)}
                className='tw-border tw-p-3'
                type='text'
              />
              <button className='tw-mt-4 tw-py-2 tw-px-4 tw-bg-blue-500 tw-text-white' onClick={() => searchId()}>confirm</button>
              </div>
              </div>)}

        </main>


          
    )
}