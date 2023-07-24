import {React, useState, useEffect} from 'react';

import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import FriendList from '../components/FriendList';
import { firestore, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, collection, query, getDocs, orderBy, deleteDoc } from 'firebase/firestore';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import Avatar from "@mui/material/Avatar";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';


export default function Friends() {
    const [user, loading] = useAuthState(auth);
    const [requests, setRequests] = useState([]);
    const [openSearch, setOpenSearch] = useState(false);
    const [displayProfile, setDisplayProfile] = useState(false);
    const [friend, setFriend] = useState("");
    const [error, setError] = useState("");
    const [friendInfo, setFriendInfo] = useState(null);
    const [openReqList, setOpenReqList] = useState(false);

    const [username, setUsername] = useState(null);
    useEffect(() => {
        if (user) {
            setUsername(user.displayName)
        }
    }, [user]);

    useEffect(() => {
        try {
            getReq();
        } catch(e) {
            console.log("Error getting requests: " + e.message);
        }
    }, [username]);

    function handleGetID() {
        try {
            navigator.clipboard.writeText(username);
            alert("Successfully copied username!");
        } catch(e) {
            console.log("Error copying username: " + e.message);
        }
    }
    async function searchId() {
        setError("");
        if (!friend) {
            setError("Please enter a username");
            return;
        }
        if (friend === username) {
            setError("You cannot add yourself as a friend!");
            return;
        }
        const dbRef = doc(firestore, `${friend}`, "info");
        const snapShot = await getDoc(dbRef);
        const friendRef = doc(firestore, `${username}`, "info", "friends", `${friend}`);
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
                const friendRef = doc(firestore, `${friend}`, `info`);
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
        setFriend("");
        setDisplayProfile(false);
        setFriendInfo(null);
        setOpenReqList(false);
    }

    async function handleConfirm() {
        const friendRef = doc(firestore, `${friend}`, 'info', 'requests', `${username}`);

        const date = await new Date();

        var day = await ("0" + date.getDate()).slice(-2);
        var month = await ("0" + (date.getMonth() + 1)).slice(-2);
        var year = await date.getFullYear();
        var time = await ("0" + date.getHours()).slice(-2) + ":" + 
                        ("0" + date.getMinutes()).slice(-2) + ":" + 
                        ("0" + date.getSeconds()).slice(-2);
        
        var currentDate = await `${year}-${month}-${day} ` + time;
        try {

            await setDoc(friendRef, {
                uid: user.uid, 
                email: user.email,
                photoURL: user.photoURL,
                username: user.displayName,
                time: currentDate,
            })

            alert("Friend request sent");
            setDisplayProfile(false);
            setFriend("");
        } catch(e) {
            console.log("Error sending friend request: " + e.message);
        }
    }

    async function getReq() {
        const reqRef = collection(firestore, `${username}`, "info", "requests");
        const q = query(reqRef, orderBy("time", "desc"));
        let reqArray = [];
        const docSnap = await getDocs(q);
        await docSnap.forEach((doc) => {
            reqArray.push(doc.data());
        });

        await setRequests(reqArray);
    }

    async function declineReq(friend) {
        console.log('decline');
        const ownRef = doc(firestore, `${username}`, 'info', 'friends', `${friend.username}`);
        try {
            const docSnap = await getDoc(ownRef);

            if (docSnap.exists()) {
                await deleteDoc(ownRef);
                alert("You have successfully declined the request");
                window.location.reload(true);
            }
        } catch(e) {
            console.log("Error removing request: " + e.message)
        }
    } 

    async function acceptReq(friend) {
        console.log('accept');
        const friendRef = doc(firestore, `${friend.username}`, 'info', 'friends', `${username}`);
        const ownRef = doc(firestore, `${username}`, 'info', 'friends', `${friend.username}`);
        const reqRef = doc(firestore, `${username}`, 'info', 'requests', `${friend.username}`);
        try { 
            await setDoc(friendRef, {
                uid: user.uid, 
                email: user.email,
                photoURL: user.photoURL,
                username: user.displayName,
                time: friend.time,
            })

            await setDoc(ownRef, friend);

            const docSnap = await getDoc(reqRef);
            if (docSnap.exists()) {
                await deleteDoc(reqRef);
            }

            alert("Friend request approved successfully!");
            window.location.reload(true);
            
        } catch(e) {
            console.log("Error adding friends: " + e.message);
        }

    }
    return (
          <main>
            <div className='container-row tw-flex'>
              <SideNav />
              <div className='tw-flex-grow tw-mx-4 tw-flex tw-flex-col'>
                <div className='tw-flex tw-flex-row'>
                    <p className='tw-font-medium tw-text-3xl tw-text-white'>Friends</p>
                    <button className="tw-ml-4 tw-p-2 light" onClick={handleGetID}>Copy Username</button>
                    <button className="tw-ml-4 tw-p-2 light" onClick={() => setOpenSearch(true)}>Add a Friend</button>
                    <Badge badgeContent={requests.length} color='primary' className="tw-mt-2 tw-mx-4" onClick={() => setOpenReqList(true)}>
                        <NotificationsIcon fontSize='medium' className='tw-text-white'></NotificationsIcon>
                    </Badge>
                    
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
                        <h3 className='tw-text-lg tw-font-medium tw-mb-4'>Enter Friend Username</h3>
                        <input
                            value={friend}
                            onChange={(event) => setFriend(event.target.value)}
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
                                <button onClick={handleConfirm} className='light tw-w-2/3 tw-rounded tw-mt-4 tw-py-2 tw-px-4'>send request</button>
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

            {openReqList && requests.length !== 0 && (
                <div className='tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-800 tw-bg-opacity-75'>
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <div className='tw-w-1/3 tw-bg-white tw-p-6 tw-rounded-lg'>
                            <h1 className='tw-font-bold tw-text-lg'>Username</h1>
                            {requests.map((req, index) => (
                                <div className="tw-flex-col">
                                    <div key={index} className='tw-flex tw-flex-row tw-items-center'>
                                        <div className='tw-basis-1/2 tw-mt-2'>{index + 1}. {req.username}</div>
                                        <div className='tw-flex-grow tw-flex tw-flex-row tw-items-center tw-justify-center'>
                                            <button onClick={() => acceptReq(req)} className='light tw-w-2/3 tw-rounded tw-mx-2 tw-mt-4 tw-py-2 tw-px-4'>Accept</button>
                                            <button onClick={() => declineReq(req)} className='tw-w-2/3 tw-rounded tw-mt-4 tw-py-2 tw-px-4 tw-bg-red-500 tw-text-white'>Decline</button>
                                        </div>
                                    </div>
                                </div>
                            ) )}
                        </div>
                    </ClickAwayListener>
                </div>
            )}

            {openReqList && requests.length === 0 && alert("You have no pending requests!")}

        </main>


          
    )
}