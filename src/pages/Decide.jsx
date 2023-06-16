import React, { useState } from 'react';
import SideNav from '../components/SideNav';
import '../css/Decide.css';
import '../css/App.css';
import TopNav from '../components/TopNav';

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
      setErrorMessage('Please add a decision name first');
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
      setErrorMessage(optionInput.trim() === '' ? 'Option provided cannot be empty' : '');
    }
  };

  const generateRandomResult = () => {
    if (options.length === 0) {
      setErrorMessage('Please add options before generating a decision');
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
    <TopNav />
    <div className='container-row centerAlign'>
      <SideNav />
      <div className='container-col choiceArea'>

        <div className='decideForm'>
          <form onSubmit={handleSubmit}>
            <div className='tw-flex tw-flex-row tw-py-2 tw-text-xl'>
              <input
                value={optionInput}
                onChange={handleOptionInput}
                className='tw-ml-1 tw-flex-1 tw-bg-transparent tw-p-3 tw-text-white tw-mr-5 tw-placeholder-white tw-placeholder-opacity-100 tw-placeholder:font-bold'
                type='text'
                placeholder='Enter Option'
              />

              <button type='submit' className='light tw-flex-grow-0 tw-w-32 tw-py-2 tw-px-4 tw-text-black'>
              Add
              </button>
            </div>
            <div>
              {errorMessage && <p className='tw-text-red-500'>{errorMessage}</p>}</div>
            
          </form>
        </div>

        <div className="section choiceBox tw-flex tw-flex-col">
          <div className='tw-flex tw-flex-row tw-py-2'>
              <p className='tw-font-bold tw-text-2xl tw-text-white tw-mr-10'>Your Options</p>
              <p className='tw-font-bold tw-text-2xl tw-text-white'>Probability</p>
          </div>

          <div className="tw-overflow-y-auto tw-overflow-x-hidden choiceList tw-w-full">
            {options.map((option, index) => (
                  <div key={index} className='tw-flex tw-flex-row tw-items-center'>
                    <p className='nfText tw-my-2 tw-basis-1/2 tw-flex-none'>{option}</p>
                    <input
                      type='number'
                      min={1}
                      max={100}
                      value={weights[index]}
                      onChange={(e) => handleWeightChange(e, index)}
                      className='nfText tw-basis-3/8 tw-mr-5 tw-text-white tw-bg-transparent tw-text-center'
                    />
                    <button className='nfText tw-basis-auto' onClick={() => deleteOption(option)}>Delete</button>
                  </div>
              ))}
          </div>
          <button onClick={clearAllOptions} className='dark clickable tw-self-center'>
            Clear All Choices
          </button>
        </div>
      </div>
        
      <div className="container-col centerButton section">
      <h2 className='tw-text-xl tw-py-2 tw-font-bold tw-text-white'>Decision Name: {currentDecision?.name}</h2>
      <button className='light tw-py-2 tw-w-40 tw-my-5 tw-px-4 tw-text-black' onClick={addNewDecision}>
          Add Decision Name
        </button>
        {currentDecision && (
          <button className='dark tw-py-2 tw-w-40 tw-px-4 tw-bg-red-500 tw-text-white' onClick={deleteDecision}>
            Delete Decision
          </button>
        )}

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
    </div>
  );
};

export default Decide;