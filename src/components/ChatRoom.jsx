import { React, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firestore, auth } from '../firebase';
import { useLocation } from 'react-router-dom';


export default function ChatRoom() {
    const [user, loading] = useAuthState(auth);
    const [currFriend, setCurrFriend] = useAuthState("");
    const [username, setUsername] = useState("");

    const location = useLocation();
    const data = location.state;

    useEffect(() => {
        if (user) {
            setUsername(user.displayName);
        }
      }, [user]);

    useEffect(() => {
        try {
          if (data) {
            setCurrFriend(data.friened)
          }
        } catch(e) {
          console.log('Error retrieving chat from prev page: ' + e.message);
        }
      }, [user]);

      return (
        <div className='tw-tex-white'>hello! chat room</div>
      )

}