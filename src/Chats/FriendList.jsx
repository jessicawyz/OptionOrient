import { React, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firestore, auth } from '../firebase';
import { collection, query, getDocs, orderBy, deleteDoc, doc, getDoc } from 'firebase/firestore';
import Avatar from "@mui/material/Avatar";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { Link } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function FriendList() {
    const [user, loading] = useAuthState(auth);
    const [friendList, setFriendList] = useState([]);
    const [username, setUsername] = useState("");

    useEffect(() => {
      if (user) {
          setUsername(user.displayName)
      }
    }, [user]);

    useEffect(() => {
      try {
          getFriends();
      } catch(e) {
          console.log("Error getting requests: " + e.message);
      }
    }, [username]);

    async function getFriends() {
        try {
          if (username) {
            const reqRef = collection(firestore, `${username}`, "info", "friends");
            const q = query(reqRef, orderBy("time", "desc"));
            let friendArray = [];
            const docSnap = await getDocs(q);
            docSnap.forEach((doc) => {
                friendArray.push(doc.data());
            });

            setFriendList(friendArray);
          }
        } catch(e) {
          console.log("Error getting friends in friendList: " + e.message);
        }

    }

    async function deleteFriend(friend) {
      const ownRef = doc(firestore, username, "info", "friends", `${friend.username}`);
      const document = await getDoc(ownRef);

      const friendRef = doc(firestore, friend.username, 'info', 'friends', username);
      const docSnap = await getDoc(friendRef);
        
        if (document.exists()) {
            await deleteDoc(ownRef);
        }

        if (docSnap.exists()) {
          await deleteDoc(friendRef);
        }

        alert("friend deleted successfully!");
        window.location.reload(true);

        
    }

    return (
      <ul className="tw-overflow-y-auto tw-overflow-x-hidden">
        {friendList.map((friend, index) => (
          <li key={index} className="tw-flex tw-flex-row tw-justify-between tw-gap-x-6 tw-py-5">
            <div className="tw-flex tw-gap-x-4">
              <Avatar alt="Friend profile" sx={{ width: 50, height: 50 }} src={friend.photoUrl} />
              <div className="tw-min-w-0 tw-flex-auto">
                <div className="tw-text-lg tw-text-white">{friend.username}</div>
                <p className="tw-mt-1 tw-truncate tw-text-xs tw-leading-5 tw-text-gray-500">{friend.email}</p>
              </div>
            </div>
            <div>
              <Link to="/chats" state={{ photoUrl: friend.photoUrl, friend: friend.username }}> <QuestionAnswerIcon className='tw-text-white tw-basis-1/6'></QuestionAnswerIcon> </Link>
              <DeleteForeverIcon onClick={() => deleteFriend(friend)}className='tw-text-white tw-text-2xl tw-ml-4 tw-cursor-pointer' />
            </div>
          </li>
        ))}
      </ul>
    )
}