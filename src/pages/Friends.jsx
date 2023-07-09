import {React, useState, useEffect} from 'react';

import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import FriendList from '../components/FriendList';
import { firestore, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import Avatar from "@mui/material/Avatar";

export default function Friends() {
    const [user, loading] = useAuthState(auth);
    const [openSearch, setOpenSearch] = useState(false);
    const [displayProfile, setDisplayProfile] = useState(false);
    const [id, setId] = useState(null);
    const [error, setError] = useState("");
    const [friendInfo, setFriendInfo] = useState(null);

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
        setError("");
        if (!id) {
            setError("Please enter an id");
            return;
        }
        if (id === uid) {
            setError("You cannot add yourself as a friend!");
            return;
        }
        const dbRef = doc(firestore, `${id}`, "info");
        const snapShot = await getDoc(dbRef);
        const friendRef = doc(firestore, `${uid}`, "info", "friends", `${id}`);
        const friendSnap = await getDoc(friendRef);

        if (friendSnap.exists()) {
            setError("You have already added them as friends!");
            return;
        }

        if (!snapShot.exists()) {
            console.log(false);
            setError("User does not exist!");
        } else {
            console.log(true);
            try {
                const friendRef = doc(firestore, `${id}`, `info`);
                const snapshot = await getDoc(friendRef);
                setFriendInfo(snapshot.data());
                console.log(friendInfo);

                setOpenSearch(false);
                setDisplayProfile(true);
            } catch(e) {
                console.log("Error finding friend: " + e.message);
            }
        }
    }

    const handleClickAway = () => {
        setError("");
        setOpenSearch(false);
        setId("");
        setDisplayProfile(false);
        setFriendInfo(null);
    }

    async function handleConfirm() {
        const addRef = doc(firestore, `${uid}`, `info`, `friends`, `${id}`);

        const date = await new Date();

        var day = await ("0" + date.getDate()).slice(-2);
        var month = await ("0" + (date.getMonth() + 1)).slice(-2);
        var year = await date.getFullYear();
        var time = await ("0" + date.getHours()).slice(-2) + ":" + 
                        ("0" + date.getMinutes()).slice(-2) + ":" + 
                        ("0" + date.getSeconds()).slice(-2);
        
        var currentDate = await `${year}-${month}-${day} ` + time;
        try {
            await setDoc(addRef, {
                email: friendInfo.email,
                photoURL: friendInfo.photoURL,
                username: friendInfo.username,
                time: currentDate,
            });

            alert("Friend added successfully!");
            setDisplayProfile(false);
            setId("");
        } catch(e) {
            console.log("Error adding friend: " + e.message);
        }
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
                <ClickAwayListener onClickAway={handleClickAway}>
                    <div className='tw-bg-white tw-p-6 tw-rounded-lg'>
                        <h3 className='tw-text-lg tw-font-medium tw-mb-4'>Enter Friend ID</h3>
                        <input
                            value={id}
                            onChange={(event) => setId(event.target.value)}
                            className='tw-border tw-p-3'
                            type='text'
                        />
                        <button className='tw-mt-4 tw-py-2 tw-px-4 tw-bg-blue-500 tw-text-white' onClick={() => searchId()}>confirm</button>
                        {error && (
                            <p className='tw-text-red-500'>{error}</p>
                        )}
                    </div>
                    </ClickAwayListener>
                </div>)}
            {displayProfile && (
                <div className='tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-800 tw-bg-opacity-75'>
                    <ClickAwayListener onClickAway={handleClickAway}>
                    <div className='tw-w-1/3 tw-bg-white tw-p-6 tw-rounded-lg'>
                        <div className='tw-flex tw-flex-row'>
                            <Avatar alt="Profile" sx={{ width: 100, height: 100 }} src={friendInfo.photoURL} className="tw-my-8"/>
                            <div className='tw-flex-grow tw-flex tw-flex-col tw-items-center tw-justify-center'>
                                <button onClick={handleConfirm} className='light tw-w-2/3 tw-rounded tw-mt-4 tw-py-2 tw-px-4'>confirm</button>
                                <button onClick={handleClickAway} className='tw-w-2/3 tw-rounded tw-mt-4 tw-py-2 tw-px-4 tw-bg-red-500 tw-text-white'>cancel</button>
                            </div>
                        </div>
                        <div>
                            <p className="tw-text-black"> Username: {friendInfo.username}</p>
                            <p className="tw-text-black"> Email: {friendInfo.email}</p>
                        </div>
                    </div>
                    </ClickAwayListener>
                </div>
            )}

        </main>


          
    )
}