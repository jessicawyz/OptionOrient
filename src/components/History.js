import { React, useState, useEffect } from 'react';
import '../css/Home.css';
import { firestore, useAuth } from '../firebase';
import { getDocs, collection } from "firebase/firestore";
import { UserAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

export default function History() {
    const optionsA = [];
    const weightsA = [];
    const namesA = [];
    const [options, setOptions] = useState([]);
    const [weights, setWeights] = useState([]);
    const [names, setNames] = useState([]);
    const user = UserAuth();

    const ref = collection(firestore, `${getAuth().currentUser.uid}`, "decision", "history")
    console.log(getAuth().currentUser.uid);
    
    useEffect(() => {
        async function getHistory() {
            const docSnap = await getDocs(ref);
            docSnap.forEach((doc) => {
                namesA.push(doc.id);
                optionsA.push(doc.data().options);
                weightsA.push(doc.data().weights);

                setNames(namesA);
                setOptions(optionsA);
                setWeights(weightsA);
            });
        }
        getHistory();
    }, [user]);


    console.log("name array after loop " + names[0]);

    return (
        <button className="history section">
            <div className="tw-text-white">History</div>
            <div className="tw-overflow-y-auto tw-overflow-x-hidden choiceList tw-w-full">
                {names.map((name, index) => (
                  <div key={index} className='tw-flex tw-flex-row tw-items-center'>
                    <Link to='/decide' state={{ name: names[index],
                                                options: options[index],
                                                weights: weights[index]}}
                                            className='tw-text-2xl tw-my-2'>
                        {name} 
                    </Link>
                  </div>
              ))}
            </div>
              
        
        </button>
    )
}