import {React, useState, useEffect, useRef} from 'react';
import '../css/Chats.css';

import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import ChatList from '../components/ChatList';
import { useLocation } from 'react-router-dom';
import FriendList from '../components/FriendList';
import { firestore, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { doc, getDoc, setDoc, collection, query, getDocs, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';

import ClickAwayListener from '@mui/base/ClickAwayListener';

export default function Chats() {
    const [user, loading] = useAuthState(auth);
    const [openChat, setOpenChat] = useState(false);
    const [messageInput, setMessageInput] = useState("");
    const [username, setUsername] = useState("");
    const [currFriend, setCurrFriend] = useState("");
    const [friendPhoto, setFriendPhoto] = useState("");
    const [databaseLoading, setDatabaseLoading] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [messageHistory, setMessageHistory] = useState([]);

    const location = useLocation();
    let data = location.state;

    
    const dummy = useRef();

    useEffect(() => {
        if (data) {
          setOpenChat(true);
          setCurrFriend(data.friend);
          setFriendPhoto(data.photoURL);
          getChatHistory();
          window.history.replaceState({}, document.title);
        }

      }, [data]);

      useEffect(() => {
        if (username && currFriend) {
          getChatHistory();
        }
      }, [username, currFriend]);


    useEffect(() => {
        if (dummy.current) {
            dummy.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messageHistory]);

    useEffect(() => {
        if (user) {
            setUsername(user.displayName);
        }
    }, [user]);


    function handleClickAway() {
        window.history.replaceState({}, document.title);
        setOpenChat(false);
    }

    async function getChatHistory() {
        if (username && currFriend) {
            const msgRef = collection(firestore, `${username}`, 'chats', 'active', `${currFriend}`, 'messages');
            const q = query(msgRef, orderBy("time"));
            
            setChatLoading(true);

            const unsubscribe = onSnapshot(q, (snapshot) => {
                let tempArray = [];
                try {
                    snapshot.forEach((doc) => {
                        if (doc.data().author === username) {
                            tempArray.push({ content: doc.data().content, self: true });
                        } else {
                            tempArray.push({ content: doc.data().content, self: false });
                        }
                    })

                    setMessageHistory(tempArray);
                    
                    
                } catch(e) {
                    console.log("Error loading message history: " + e.message);
                    setChatLoading(false);
                }
        
            })

            setChatLoading(false);
            return () => unsubscribe();
        }
    }
        

    async function handleSend(event) {
        event.preventDefault()
        const date = new Date();
        

        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();
        var time = ("0" + date.getHours()).slice(-2) + ":" + 
                    ("0" + date.getMinutes()).slice(-2) + ":" + 
                    ("0" + date.getSeconds()).slice(-2);
        
        var currentDate = `${year}-${month}-${day} ` + time;
        setDatabaseLoading(true);


        const tempInput = messageInput;
        setMessageInput("");

        
        try {
            if (tempInput !== "" && tempInput.trim().length !== 0) {
            const msgRef = collection(firestore, `${username}`, 'chats', 'active', `${currFriend}`, `messages`);
            await addDoc(msgRef, {
                content: tempInput,
                time: Timestamp.now().toMillis(),
                author: username,
                unread: false,
            })

            const friendRef = collection(firestore, `${currFriend}`, 'chats', 'active', `${username}`, `messages`);
            await addDoc(friendRef, {
                content: tempInput,
                time: Timestamp.now().toMillis(),
                author: username,
                unread: true,
            })
            


            const ownRefInfo = doc(firestore, `${username}`, 'chats', 'active', `${currFriend}`);
            const friendRefInfo = doc(firestore, `${currFriend}`, 'chats', 'active', `${username}`);

            await setDoc(ownRefInfo, {
                lastMessageTime: currentDate,
                unread: 0,
            })

            const friendSnap = await getDoc(friendRefInfo);

            let newUnread = 0;
            if (friendSnap.data() && typeof friendSnap.data().unread == 'number') {
                newUnread = friendSnap.data().unread + 1;
            }
            

            await setDoc(friendRefInfo, {
                lastMessageTime: currentDate,
                unread: newUnread,
            })
        }


            setDatabaseLoading(false);
            

        } catch(e) {
            console.log("Error adding message sent to database: " + e.message);
            setDatabaseLoading(false);
        }

    }

    const handleMessageInput = (event) => {
        setMessageInput(event.target.value);
    }

    function ChatMessage(props) {
        const { self, content } = props.msg;

        if (self) {
            return (
                <div className='tw-flex tw-flex-row sent tw-w-full'>
                    <p className='chat'>{content}</p>
                </div>
            )
        } else {
            return (
                <div className='tw-flex tw-flex-row receive tw-w-full'>
                    <p className='chat'>{content}</p>
                </div>
            )
        }

        
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

                            <div className="chatSec tw-h-4/6 tw-mx-4 tw-overflow-y-auto">
                                <ul className="tw-w-full">
                                    {messageHistory.map((message, index) => (
                                        <li key={index} className="tw-flex tw-flex-row-reverse tw-justify-between tw-gap-x-6 tw-py-5 tw-w-full">
                                            <ChatMessage key={index} msg={message}></ChatMessage>
                                                
                                        </li>
                                        

                                    ))}
                                </ul>
                                <div ref={dummy}></div>
                                
                            </div>
                            


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