import {React, useState, useEffect} from 'react';
import '../css/Chats.css';

import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import ChatList from '../components/ChatList';
import { useLocation } from 'react-router-dom';
import FriendList from '../components/FriendList';
import { firestore, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, collection, query, getDocs, orderBy, updateDoc, deleteDoc } from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';

import ClickAwayListener from '@mui/base/ClickAwayListener';

export default function Chats() {
    const [user, loading] = useAuthState(auth);
    const [currFriend, setCurrFriend] = useState("");
    const [friendPhoto, setFriendPhoto] = useState("");
    const [openChat, setOpenChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

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
            setFriendPhoto(data.photoURL);
            console.log(data);
        }
    }, [data]);

    useEffect(() => {
        if (currFriend) {
            getChatHistory();
        }
    })

    function handleClickAway() {
        setOpenChat(false);
    }

    async function getChatHistory() {
        const msgRef = collection(firestore, `${username}`, 'chats', 'active', `${currFriend}`, 'messages');
        const q = query(msgRef, orderBy("time"));
        const docSnap = await getDocs(q);

        let tempArray = [];
        try {
            docSnap.forEach((doc) => {
                if (doc.data().author === username) {
                    tempArray.push({ content: doc.data().content, self: true });
                } else {
                    tempArray.push({ content: doc.data().content, self: false });
                }
            })

            setMessages(tempArray);
        } catch(e) {
            console.log("Error loading message history: " + e.message);
        }
    }

    async function handleSend() {
        const date = await new Date();

        var day = await ("0" + date.getDate()).slice(-2);
        var month = await ("0" + (date.getMonth() + 1)).slice(-2);
        var year = await date.getFullYear();
        var time = await ("0" + date.getHours()).slice(-2) + ":" + 
                        ("0" + date.getMinutes()).slice(-2) + ":" + 
                        ("0" + date.getSeconds()).slice(-2);
        
        var currentDate = await `${year}-${month}-${day} ` + time;

        //try {
            const msgRef = doc(firestore, `${username}`, 'chats', 'active', `${currFriend}`, `messages`, `${currentDate}`);
            await setDoc(msgRef, {
                content: messageInput,
                time: currentDate,
                author: username,
                unread: true,
            })

            const friendRef = doc(firestore, `${currFriend}`, 'chats', 'active', `${username}`, `messages`, `${currentDate}`);
            await updateDoc(friendRef, {
                content: messageInput,
                time: currentDate,
                author: username,
                unread: true,
            })

            const ownRefInfo = doc(firestore, `${username}`, 'chats', 'active', `${currFriend}`);
            const friendRefInfo = doc(firestore, `${currFriend}`, 'chats', 'active', `${username}`);
            await updateDoc(ownRefInfo, {
                lastMessageTime: currentDate,
                unread: 0,
            })

            const friendSnap = getDoc(friendRefInfo);

            let newUnread = 0;
            if (friendSnap.unread) {
                newUnread = friendSnap.unread + 1;
            }

            await setDoc(friendRefInfo, {
                lastMessageTime: currentDate,
                unread: newUnread,
            })

        /*} catch(e) {
            console.log("Error adding message sent to database: " + e.message);
        }*/

    }

    const handleMessageInput = (event) => {
        setMessageInput(event.target.value);
    }

    
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

            { openChat && (
                <div className='tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-800 tw-bg-opacity-75'>
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <div className='chatBox tw-flex tw-flex-col tw-w-3/4 tw-h-full tw-rounded-lg'>
                            <div className='header tw-w-full tw-h-1/6'>
                                <div className='tw-m-4 tw-flex tw-flex-row tw-text-white tw-text-3xl'>
                                <Avatar className="tw-mx-4" sx={{ width: 70, height: 70 }} src={friendPhoto} />
                                <div className='tw-mt-4'>{currFriend}</div>
                                </div>
                            </div>

                            <div className="chatSec tw-h-4/6 tw-mx-4"></div>


                            <form onSubmit={handleSend} className='tw-mx-4'>
                                <div className='tw-flex tw-flex-row tw-py-2 tw-text-xl'>
                                <input
                                    value={messageInput}
                                    onChange={handleMessageInput}
                                    className='tw-ml-1 tw-flex-1 tw-bg-transparent tw-p-3 tw-text-white tw-mr-5 tw-placeholder-white tw-placeholder-opacity-70 tw-placeholder:font-bold'
                                    type='text'
                                    placeholder='Enter Message'
                                />
                                <button type='submit' className='light tw-flex-grow-0 tw-w-32 tw-py-2 tw-px-4 tw-text-black'>
                                Send </button>
                                </div>
                            </form>

                        </div>
                    </ClickAwayListener>

                </div>
            )}
        </main>
    )

}