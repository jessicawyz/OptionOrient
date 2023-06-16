import React, { useState } from 'react';

const Decide = () => {
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState('');
  const [optionInput, setOptionInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [decisionName, setDecisionName] = useState('');
  const [showDecisionNameInput, setShowDecisionNameInput] = useState(false);
  const [currentDecision, setCurrentDecision] = useState(null);
  const [weights, setWeights] = useState([]);
  const [decisionAdded, setDecisionAdded] = useState(false);

  const handleOptionInput = (event) => {
    setOptionInput(event.target.value);
  };

  //all the error message are kind of useless here and everywhere else, 
  //since they get customized later on in the display part anyway but just in case
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!decisionAdded) {
      setErrorMessage('You need to add a decision first');
      return;
    }
    if (optionInput.trim() !== '' && optionInput.trim() !== ' ') {
      if (options.includes(optionInput)) {
        setErrorMessage('Option already exists');
        return;
      }
      setOptions([...options, optionInput]);
      setWeights([...weights, 1]);
      setOptionInput('');
      setErrorMessage('');
    } else {
      setErrorMessage(optionInput.trim() === '' ? 'You need to enter an option' : '');
    }
  };

  const generateRandomResult = () => {
    if (options.length === 0) {
      setErrorMessage('Please add options');
      return;
    }

    const weightedOptions = options.map((option, index) => {
      return { option, weight: weights[index] };
    });

    const totalWeight = weightedOptions.reduce((sum, option) => sum + option.weight, 0);
    const randomNum = Math.random() * totalWeight;

    let weightSum = 0;
    let chosenOption = null;
    for (const option of weightedOptions) {
      weightSum += option.weight;
      if (randomNum <= weightSum) {
        chosenOption = option.option;
        break;
      }
    }

    setResult(chosenOption);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const clearAllOptions = () => {
    setOptions([]);
    setWeights([]);
    setResult('');
  };

  const handleDecisionNameInput = (event) => {
    setDecisionName(event.target.value);
  };

  const handleConfirmDecisionName = () => {
    if (decisionName.trim() === '') {
      setErrorMessage('Please enter a decision name');
      return;
    }

    const decision = {
      name: decisionName,
      options: options,
    };
    setCurrentDecision(decision);
    setShowDecisionNameInput(false);
    setOptions([]);
    setWeights([]);
    setDecisionName('');
    setDecisionAdded(true);
  };


  const deleteDecision = () => {
    if (!currentDecision) {
      setErrorMessage('Please select a decision to delete');
      return;
    }

    setCurrentDecision(null);
    setOptions([]);
    setWeights([]);
    setDecisionAdded(false);
  };

  const deleteOption = (option) => {
    const optionIndex = options.indexOf(option);
    const updatedOptions = [...options];
    updatedOptions.splice(optionIndex, 1);

    const updatedWeights = [...weights];
    updatedWeights.splice(optionIndex, 1);

    setOptions(updatedOptions);
    setWeights(updatedWeights);
  };

  const handleWeightChange = (event, index) => {
    const updatedWeights = [...weights];
    updatedWeights[index] = parseInt(event.target.value);
    setWeights(updatedWeights);
  };

  const addNewDecision = () => {
    setShowDecisionNameInput(true);
    setCurrentDecision(null);
    setOptions([]);
    setWeights([]);
  };

  return (
    <div>
      {currentDecision === null && <p className='tw-text-red-500'>You need to add a decision first</p>}
      <h2 className='tw-py-2 tw-font-medium tw-text-white'>Decision Name: {currentDecision?.name}</h2>

      <button className='tw-py-2 tw-px-4 tw-bg-blue-500 tw-text-white' onClick={addNewDecision}>
          Add Decision
        </button>
        {currentDecision && (
          <button className='tw-py-2 tw-px-4 tw-bg-red-500 tw-text-white' onClick={deleteDecision}>
            Delete Decision
          </button>
        )}

      {currentDecision && (
        <div>
          <div className='tw-flex tw-flex-row tw-py-2'>
            <h2 className='tw-font-medium tw-text-white'>Your Options</h2>
            <h2 className='tw-ml-4 tw-font-medium tw-text-white'>Probability</h2>
            <div className='tw-flex tw-py-2'>
      </div>
          </div>
          <div className='tw-flex tw-flex-col tw-py-2'>
            {options.map((option, index) => (
              <div key={index} className='tw-flex tw-items-center'>
                <p className='tw-py-2 tw-font-medium tw-text-white'>{option}</p>
                <input
                  type='number'
                  min={1}
                  max={100}
                  value={weights[index]}
                  onChange={(e) => handleWeightChange(e, index)}
                  className='tw-border tw-p-2 tw-w-16 tw-ml-2'
                />
                <button onClick={() => deleteOption(option)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className='tw-flex tw-flex-col tw-py-2'>
          <label className='tw-py-2 tw-font-medium tw-text-white'>Enter Options</label>
          <input value={optionInput} onChange={handleOptionInput} className='tw-border tw-p-3' type='text' />
          {errorMessage && currentDecision !== null && options.length === 0 && <p className='tw-text-red-500'>You need to enter an option</p>}
          {errorMessage && currentDecision !== null && optionInput === '' && <p className='tw-text-red-500'>Option cannot be empty</p>}
          {errorMessage && currentDecision !== null && options.includes(optionInput) && <p className='tw-text-red-500'>Option already exists</p>}
        </div>
        <button type='submit' className='tw-py-2 tw-px-4 tw-bg-blue-500 tw-text-white'>
          Add Option
        </button>
      </form>

      <button onClick={generateRandomResult} className='tw-py-2 tw-px-4 tw-bg-green-500 tw-text-white'>
        Make the decision!
      </button>
      <button onClick={clearAllOptions} className='tw-py-2 tw-px-4 tw-bg-red-500 tw-text-white'>
        Clear All Options
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

      {showDecisionNameInput && !currentDecision && (
        <div className='tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-800 tw-bg-opacity-75'>
          <div className='tw-bg-white tw-p-6 tw-rounded-lg'>
            <h3 className='tw-text-lg tw-font-medium tw-mb-4'>Enter Decision Name</h3>
            <input
              value={decisionName}
              onChange={handleDecisionNameInput}
              className='tw-border tw-p-3'
              type='text'
            />
            {errorMessage && decisionName.trim() === '' && <p className='tw-text-red-500'>You need to enter a decision name</p>}
            <button className='tw-mt-4 tw-py-2 tw-px-4 tw-bg-blue-500 tw-text-white' onClick={handleConfirmDecisionName}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Decide;