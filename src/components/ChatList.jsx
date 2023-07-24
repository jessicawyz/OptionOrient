import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firestore, auth } from '../firebase';
import { collection, doc, query, getDocs, orderBy, getDoc } from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';



export default function ChatList() {
    const [user, loading] = useAuthState(auth);
    const [username, setUsername] = useState(null);
    const [chatList, setChatList] = useState([]);
    const [chatLoading, setChatLoading] = useState(true);

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
        if (username) {

            const reqRef = collection(firestore, `${username}`, "chats", "active");
            const q = query(reqRef, orderBy("lastMessageTime", "desc"));

    
            const docSnap = await getDocs(q);
            const promises = docSnap.docs.map(async (document) => {
                const friendRef = doc(firestore, `${document.id}`, 'info');
                const friendSnap = await getDoc(friendRef);
                const unreadRef = doc(firestore, `${username}`, 'chats', 'active', `${document.id}`);
                const unreadSnap = await getDoc(unreadRef);
                return { displayName: document.id, photoURL: friendSnap.photoURL, unread: unreadSnap.data().unread || 0 };
              });
          
              const chatArray = await Promise.all(promises);

            setChatList(chatArray);
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
                                { /*friendData.unread !== 0 && (
                                    <div className='tw-text-m tw-text-white'>{friendData.unread} unread messages</div>
                                )*/}
                                
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
