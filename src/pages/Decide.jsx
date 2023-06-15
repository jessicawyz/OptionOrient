import React, { useState } from 'react';
import SideNav from '../components/SideNav';
import '../css/Decide.css';
import '../css/App.css';
import TopNav from '../components/TopNav';

const Decide = () => {
  const [choices, setChoices] = useState([]);
  const [result, setResult] = useState('');
  const [choiceInput, setChoiceInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChoiceInput = (event) => {
    setChoiceInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (choiceInput.trim() !== '' && choiceInput.trim() !== ' ') {
      setChoices([...choices, choiceInput]);
      setChoiceInput('');
      setErrorMessage('');
    } else {
      setErrorMessage('You need to enter a choice');
    }
  };

  const generateRandomResult = () => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    setResult(choices[randomIndex]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const clearAllChoices = () => {
    setChoices([]);
    setResult('');
  };

  return (
    <div>
    <TopNav />
    <div className='container-row centerAlign'>
      <SideNav />
      <div className='container-col choiceArea'>
        <div className='decideForm'>
          <form class="w-full max-w-sm" onSubmit={handleSubmit}>
            <div className='tw-flex tw-flex-row tw-py-2 tw-text-xl'>
              <input
                value={choiceInput}
                onChange={handleChoiceInput}
                className='tw-ml-1 tw-flex-1 tw-bg-transparent tw-p-3 tw-text-white tw-mr-5 tw-placeholder-white tw-placeholder-opacity-100 tw-placeholder:font-bold'
                type='text'
                placeholder='Enter Choice'
              />
              <button type='submit' className='light tw-flex-grow-0 tw-w-32 tw-py-2 tw-px-4 tw-text-black'>
              Add
              </button>
            </div>
            <div>{errorMessage && <p className='tw-text-red-500'>{errorMessage}</p>}</div>
            
          </form>
        </div>

        <div className="section choiceBox tw-flex tw-flex-col">
          <h1 className="tw-font-bold tw-text-3xl tw-text-white">Options</h1>
          <div className="overflowScroll choiceList">
            {choices.map((choice, index) => (
                <p key={index} className='nfText tw-my-2'>
                  {choice}
                </p>
              ))}
          </div>
          <button onClick={clearAllChoices} className='dark clickable tw-self-center'>
            Clear All Choices
          </button>
        </div>
      </div>
        
      <div className="container-col centerButton section">
        <button onClick={generateRandomResult} className='clickable generate'>
          Make the decision!
        </button>
      </div>

      {showModal && (
        <div className='tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-800 tw-bg-opacity-75'>
          <div className='tw-bg-white tw-p-6 tw-rounded-lg'>
            <h3 className='tw-text-lg tw-font-medium tw-mb-4'>The Decision</h3>
            <p style={{ color: 'black' }}>{result}</p>
            <button className='tw-mt-4 tw-py-2 tw-px-4 tw-bg-blue-500 tw-text-white' onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Decide;