import React, { useState } from 'react';

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
      <h2 className='tw-py-2 tw-font-medium tw-text-white'>Your Choices</h2>
      <div className='tw-flex tw-flex-col tw-py-2'>
        {choices.map((choice, index) => (
          <p key={index} className='tw-py-2 tw-font-medium tw-text-white'>
            {choice}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className='tw-flex tw-flex-col tw-py-2'>
          <label className='tw-py-2 tw-font-medium tw-text-white'>Enter Choices</label>
          <input
            value={choiceInput}
            onChange={handleChoiceInput}
            className='tw-border tw-p-3'
            type='text'
          />
          {errorMessage && <p className='tw-text-red-500'>{errorMessage}</p>}
        </div>
        <button type='submit' className='tw-py-2 tw-px-4 tw-bg-blue-500 tw-text-white'>
          Add Choice
        </button>
      </form>
      <button onClick={generateRandomResult} className='tw-py-2 tw-px-4 tw-bg-green-500 tw-text-white'>
        Generate Random Result
      </button>
      <button onClick={clearAllChoices} className='tw-py-2 tw-px-4 tw-bg-red-500 tw-text-white'>
        Clear All Choices
      </button>
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
  );
};

export default Decide;