import { React, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firestore, auth } from '../firebase';

import { collection, doc, query, getDocs, orderBy, getDoc } from 'firebase/firestore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { useNavigate, Link } from 'react-router-dom'


export default function ChatList() {
    const [user, loading] = useAuthState(auth);
    const [username, setUsername] = useState(null);
    const [chatList, setChatList] = useState([]);
    const [unread, setUnread] = useState(0);

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
        }
      }, [username]);

      async function getChats() {
        if (username) {
            const reqRef = collection(firestore, `${username}`, "chats", "active");
            const q = query(reqRef, orderBy("lastMessageTime", "desc"));

            let chatArray = [];
            const docSnap = await getDocs(q);
            await docSnap.forEach(async (document) => {
                const friendRef = doc(firestore, `${document.id}`, 'info');
                const friendSnap = await getDoc(friendRef);
                chatArray.push({ displayName: document.id, photoURL: friendSnap.photoURL });
                setUnread(document.data().unread);
            });

            setChatList(chatArray);
        }
    }
    
    return (
        <main>
            <ul className="tw-overflow-y-auto tw-overflow-x-hidden tw-w-full">
                {chatList.map((friendData, index) => (
                    <li key={index} className="tw-flex tw-flex-row tw-justify-between tw-gap-x-6 tw-py-5 tw-w-full">
                        <div className="tw-flex tw-gap-x-4">
                            <Avatar alt="Friend profile" sx={{ width: 50, height: 50 }} src={friendData.photoUrl} />
                            <Link to='/chats' className="tw-min-w-0 tw-flex-auto" state={{ photoURL: friendData.photoURL, friend: friendData.displayName}}>
                                <div className="tw-text-lg tw-text-white">{friendData.displayName}</div>
                                { unread !== 0 && (
                                    <div className='tw-text-m tw-text-white'>{unread} unread message</div>
                                )}
                            </Link>
                        </div>
                    </li>
                ))}

            </ul>
        </main>
    );


}
