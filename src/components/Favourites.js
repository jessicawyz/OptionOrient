import { React, useState, useEffect } from 'react';
import '../css/Home.css';
import { firestore, auth } from '../firebase';
import { getDocs, setDoc, updateDoc, doc, getDoc, collection, orderBy, query, limit, deleteDoc } from "firebase/firestore";
import { Link } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Favourites() {
    const optionsA = [];
    const weightsA = [];
    const namesA = [];
    
    const [options, setOptions] = useState([]);
    const [weights, setWeights] = useState([]);
    const [names, setNames] = useState([]);
    //const user = UserAuth();

    const [user, loading] = useAuthState(auth);
    const [uid, setUid] = useState(null);
    useEffect(() => {
        if (user) {
            setUid(user.uid)
        }
    }, [user]);

    const favRef = collection(firestore, `${uid}`, "decision", "favourites");
    
    useEffect(() => {
        getFavs();
    }, [uid]);

    async function getFavs() {
        const q = await query(favRef, orderBy("time", "desc"), limit(50));
        const docSnap = await getDocs(q);
            docSnap.forEach((doc) => {
                namesA.push(doc.id);
                optionsA.push(doc.data().options);
                weightsA.push(doc.data().weights); 
        });
        setNames(namesA);
        setOptions(optionsA);
        setWeights(weightsA); 
    }

    function changeFav(event, index) {
        const date = new Date();
    
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();
        var time = ("0" + date.getHours()).slice(-2) + ":" + 
                        ("0" + date.getMinutes()).slice(-2) + ":" + 
                        ("0" + date.getSeconds()).slice(-2);
        
        var currentDate = `${year}-${month}-${day} ` + time;

        if (event.target.checked) {
            storeFav(names[index], options[index], weights[index], currentDate);
        } else {
            deleteFav(names[index]);
        }
    }

    async function storeFav(name, options, weights, currentDate) {
        const faveRef = doc(firestore, `${uid}`, "decision", "favourites", `${name}`);
        const historyRef = doc(firestore, `${uid}`, "decision", "history", `${name}`);

        await setDoc(faveRef, {
            time: currentDate,
            options: options,
            weights: weights,
        });

        await updateDoc(historyRef, {
            favorite: true,
        });
      }

      async function deleteFav(name) {
        const faveRef = doc(firestore, `${uid}`, "decision", "favourites", `${name}`);
        const historyRef = doc(firestore, `${uid}`, `decision`, `history`, `${name}`);
        const document = await getDoc(faveRef);
        
        if (document.exists()) {
            await deleteDoc(faveRef);
        }

        await updateDoc(historyRef, {
            favorite: false,
        });
      }
    
    return (
        <button className="favourites section">
            <div className="tw-text-white">Favorites</div>
            <div className="tw-overflow-y-auto tw-overflow-x-hidden choiceList tw-w-full">
                {names.map((name, index) => (
                    <div className="tw-flex-col">
                        <div key={index} className='tw-flex tw-flex-row tw-items-center'>
                            <Link to='/decide' state={{ name: names[index],
                                                        options: options[index],
                                                        weights: weights[index]}}
                                                    className='tw-text-2xl tw-my-2 tw-basis-3/4 tw-flex-none tw-text-left'>
                                {name} 
                            </Link>
                            <Checkbox
                                defaultChecked={true}
                                icon={<FavoriteBorder className='tw-text-white'/>} 
                                checkedIcon={<Favorite className='tw-text-white'/>}
                                onChange={(event) => changeFav(event, index)} />
                        </div>
                    </div>
              ))}
            </div>
              
        
        </button>
    )
}