import {React, useState, useEffect} from 'react';

import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import ChatList from '../components/ChatList';
import ChatRoom from '../components/ChatRoom';
import { useLocation } from 'react-router-dom';
import FriendList from '../components/FriendList';
import { firestore, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, collection, query, getDocs, orderBy, deleteDoc } from 'firebase/firestore';

import ClickAwayListener from '@mui/base/ClickAwayListener';

export default function Chats() {
    const [user, loading] = useAuthState(auth);
    const [currFriend, setCurrFriend] = useState("");
    const [openChat, setOpenChat] = useState(false);

    const [username, setUsername] = useState(null);

    const location = useLocation();
    const data = location.state;

    useEffect(() => {
        if (user) {
            setUsername(user.displayName);
        }
    }, [user]);

    useEffect(() => {
        if (data) {
            setOpenChat(true);
            setCurrFriend(data.friend);
        }
    }, [user]);

    return (
        <main>
            <div className='container-row tw-flex'>
              <SideNav />
              <div className='tw-flex-grow tw-mx-4 tw-flex tw-flex-col'>
                <div className='tw-flex tw-flex-row'>
                    <p className='tw-font-medium tw-text-3xl tw-text-white'>Chats</p>
                </div>
                <ChatList />
              </div>
              
              <TopNav />
            </div>
        </main>
    )

}