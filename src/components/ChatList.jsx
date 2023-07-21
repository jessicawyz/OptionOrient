import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firestore, auth } from '../firebase';
import { collection, doc, query, getDocs, orderBy, getDoc } from 'firebase/firestore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { useNavigate, Link } from 'react-router-dom';



export default function ChatList() {
    const [user, loading] = useAuthState(auth);
    const [username, setUsername] = useState(null);
    const [chatList, setChatList] = useState([]);
    const [chatLoading, setChatLoading] = useState(true);

    const unread = 0;
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            setUsername(user.displayName);
        }
      }, [user]);

    
    useEffect(() => {
        try {
           getChats();
        } catch(e) {
            console.log("Error getting requests: " + e.message);
            setChatLoading(false);
        }
      }, [username]);

      useEffect(() => {
        if (chatList.length > 0) {
          setChatLoading(false);
        }
      }, [chatList]);

      async function getChats() {
        console.log("got chats");
        if (username) {
            const reqRef = collection(firestore, `${username}`, "chats", "active");
            const q = query(reqRef, orderBy("lastMessageTime", "desc"));

            let chatArray = [];
            const docSnap = await getDocs(q);
            docSnap.forEach(async (document) => {
                const friendRef = doc(firestore, `${document.id}`, 'info');
                const friendSnap = await getDoc(friendRef);
                chatArray.push({ displayName: document.id, photoURL: friendSnap.photoURL });
            });

            setChatList(chatArray);
            console.log(chatArray);
            setChatLoading(false);
        }
    }

    
    
    return (
        <main>
            { chatLoading ? (
                <div className='tw-text-white'>Loading...</div>
            ) : chatList.length > 0 ? (
            <ul className="tw-overflow-y-auto tw-overflow-x-hidden tw-w-full">
                {chatList.map((friendData, index) => (
                    <li key={index} className="tw-flex tw-flex-row tw-justify-between tw-gap-x-6 tw-py-5 tw-w-full">
                        <div className="tw-flex tw-gap-x-4">
                            <Avatar alt="Friend profile" sx={{ width: 50, height: 50 }} src={friendData.photoURL} />
                            <Link to='/chats' className="tw-min-w-0 tw-flex-auto" state={{ photoURL: friendData.photoURL, friend: friendData.displayName}}>
                                <div className="tw-text-lg tw-text-white">{friendData.displayName}</div>
                                { unread !== 0 && (
                                    <div className='tw-text-m tw-text-white'>{unread} unread messages</div>
                                )}
                                
                            </Link>
                        </div>
                    </li>
                ))}

            </ul>
            ) : (
                <div className='tw-text-white'>No chats available</div>
            )}
        </main>
    );


}
