const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = dom.window.document;

const { debounce } = require('../script.js');

// Mock the function that needs debouncing
const mockFunction = jest.fn();

// Mock the timers
jest.useFakeTimers();

describe('debounce', () => {
  test('should debounce function calls', () => {
    const debouncedFunction = debounce(mockFunction, 100);

    // Call the debounced function multiple times
    debouncedFunction();
    debouncedFunction();
    debouncedFunction();

    // Fast-forward time by 100ms
    jest.runOnlyPendingTimers();

    // Now the debounced function should have been called only once
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

});
