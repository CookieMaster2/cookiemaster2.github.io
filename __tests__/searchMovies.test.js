// __tests__/searchMovies.test.js

const { JSDOM } = require('jsdom');
const { searchMovies } = require('../script'); // Adjust the path accordingly

describe('searchMovies', () => {
    beforeEach(() => {
        // Set up the DOM with an empty value for '#busqueda'
        document.body.innerHTML = '<input id="busqueda" value="">';
    });

    test('should handle empty query', async () => {
        // Create a mock function to replace console.log
        const mockConsoleLog = jest.fn();

        // Replace console.log with the mock function
        global.console.log = mockConsoleLog;

        // Call the function
        await searchMovies();

        // Assert that console.log was called at least once
        expect(mockConsoleLog).toHaveBeenCalled();

        // Extract the arguments passed to the first call (assuming it was called)
        const firstCallArgs = mockConsoleLog.mock.calls[0] || [];

        // Assert that the first call's argument matches the expected message
        expect(firstCallArgs[0]).toEqual('empty query!');

        // Restore the original console.log
        global.console.log = console.log;

        // Assert any other expectations for the DOM or behavior
    });

    test('should handle successful API calls', async () => {
        // Set up the DOM with a non-empty value for '#busqueda'
        document.querySelector('#busqueda').value = 'Avengers';

        // Mock the global fetch function
        global.fetch = jest.fn().mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue({ results: [] }), // Provide your mock data here
        });

        // Call the function
        await searchMovies();

        // Assert any expectations for the DOM or behavior based on successful API calls
    });

    test('should handle API errors', async () => {
        // Set up the DOM with a non-empty value for '#busqueda'
        document.querySelector('#busqueda').value = 'Avengers';

        // Mock the global fetch function to reject the promise (simulate an API error)
        global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));

        // Call the function
        await searchMovies();

        // Assert any expectations for the DOM or behavior based on API errors
    });

    afterEach(() => {
        // Clean up and reset the mock after each test
        jest.resetAllMocks();
    });
});
