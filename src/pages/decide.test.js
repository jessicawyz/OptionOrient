const generateRandomResult = (options, weights) => {
  if (options.length === 0) {
    setErrorMessage('Please add options before generating a decision');
    return;
  }

  const weightedOptions = options.map((option, index) => {
    return { option, weight: weights[index] };
  });

  const totalWeight = weightedOptions.reduce((sum, option) => sum + option.weight, 0);

  // Make sure no probability is left blank
  if (weights.reduce((sum, weight) => sum + weight, 0) !== totalWeight) {
    setErrorMessage('Please enter probabilities for all options');
    return;
  }
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

  return chosenOption;
};

describe('generateRandomResult', () => {
  it('should return a valid option', () => {
    // Set up the necessary data
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const weights = [1, 2, 3];

    // Mock the Math.random() function to always return 0.5
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5;
    global.Math = mockMath;

    // Call the function and get the result
    const result = generateRandomResult(options, weights);

    // Make assertions to validate the result
    expect(result).toEqual('Option 2');
  });
});

describe('generateRandomResult', () => {
  it('should return a valid option with extremely large weights', () => {
    // Set up the necessary data
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const weights = [100000000000000000000, 100000000000000000000, 100000000000000000000];

    // Mock the Math.random() function to always return 0.5
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5;
    global.Math = mockMath;

    // Call the function and get the result
    const result = generateRandomResult(options, weights);

    // Make assertions to validate the result
    expect(result).toEqual('Option 2');
  });

  it('should handle extremely large total weight', () => {
    // Set up the necessary data
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const weights = [100000000000000000000, 100000000000000000000, 100000000000000000000];

    // Mock the Math.random() function to always return a value less than 1
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.9;
    global.Math = mockMath;

    // Call the function and get the result
    const result = generateRandomResult(options, weights);

    // Make assertions to validate the result
    expect(result).toEqual('Option 3');
  });
});

describe('generateRandomResult', () => {
  it('should return the only available option when there is only one option', () => {
    // Set up the necessary data
    const options = ['Option 1'];
    const weights = [1];

    // Mock the Math.random() function to always return 0.5
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5;
    global.Math = mockMath;

    // Call the function and get the result
    const result = generateRandomResult(options, weights);

    // Make assertions to validate the result
    expect(result).toEqual('Option 1');
  });

  it('should handle a large number of options and return a valid option', () => {
    // Set up the necessary data
    const options = [];
    const weights = [];
    const numOptions = 10000;

    // Generate options and weights
    for (let i = 0; i < numOptions; i++) {
      options.push(`Option ${i + 1}`);
      weights.push(i + 1);
    }

    // Mock the Math.random() function to always return 0.5
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5;
    global.Math = mockMath;

    // Call the function and get the result
    const result = generateRandomResult(options, weights);

    // Make assertions to validate the result
    expect(result).toMatch(/^Option \d+$/);
    expect(options.includes(result)).toBeTruthy();
  });
});


