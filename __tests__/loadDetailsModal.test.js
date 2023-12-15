// __tests__/loadDetailsModal.test.js

const { JSDOM } = require('jsdom');
const { loadDetailsModal } = require('../script'); // Adjust the path accordingly

// Create a mock DOM environment
const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = dom.window.document;

describe('loadDetailsModal', () => {

    test('should load movie details into modal', () => {
        // Mock data for a movie
        const movieData = {
            id: 123,
            title: 'Sample Movie',
            poster_path: '/sample-poster.jpg',
            overview: 'A sample movie overview.',
            release_date: '2023-01-01',
        };

        // Set up the modal elements in the DOM
        const modalTitle = document.createElement('div');
        modalTitle.id = 'movieModalLabel';
        document.body.appendChild(modalTitle);

        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        document.body.appendChild(modalBody);

        const collectionButton = document.createElement('button');
        collectionButton.id = 'collection-button';
        document.body.appendChild(collectionButton);

        // Call the function with the movie data
        loadDetailsModal(movieData, true);

        // Assert the expected content in the modal
        expect(modalTitle.textContent).toBe('Sample Movie');
        expect(modalBody.innerHTML).toContain('<img src="https://image.tmdb.org/t/p/original/sample-poster.jpg" alt="Sample Movie"');
        expect(modalBody.innerHTML).toContain('<p>A sample movie overview.</p>');
        expect(modalBody.innerHTML).toContain('<p>Release Date: 2023-01-01</p>');
    });

    // test('should load TV series details into modal', () => {
    //     // Mock data for a TV series
    //     const tvData = {
    //         id: 456,
    //         name: 'Sample TV Series',
    //         poster_path: '/sample-tv-poster.jpg',
    //         overview: 'A sample TV series overview.',
    //         first_air_date: '2023-02-01',
    //     };

    //     // Set up the modal elements in the DOM
    //     const modalTitle = document.createElement('div');
    //     modalTitle.id = 'movieModalLabel';
    //     document.body.appendChild(modalTitle);

    //     const modalBody = document.createElement('div');
    //     modalBody.className = 'modal-body';
    //     document.body.appendChild(modalBody);

    //     const collectionButton = document.createElement('button');
    //     collectionButton.id = 'collection-button';
    //     document.body.appendChild(collectionButton);

    //     // Call the function with the TV series data
    //     loadDetailsModal(tvData, false);

    //     // Assert the expected content in the modal
    //     expect(modalTitle.textContent).toBe('Sample TV Series');
    //     expect(modalBody.innerHTML).toContain('<img src="https://image.tmdb.org/t/p/original/sample-tv-poster.jpg" alt="Sample TV Series"');
    //     expect(modalBody.innerHTML).toContain('<p>A sample TV series overview.</p>');
    //     expect(modalBody.innerHTML).toContain('<p>First Air Date: 2023-02-01</p>');
    // });

    // test('should handle missing details', () => {
    //     // Mock data with missing details
    //     const incompleteData = {
    //         id: 789,
    //         title: 'Incomplete Movie',
    //         // Missing poster_path, overview, release_date
    //     };

    //     // Set up the modal elements in the DOM
    //     const modalTitle = document.createElement('div');
    //     modalTitle.id = 'movieModalLabel';
    //     document.body.appendChild(modalTitle);

    //     const modalBody = document.createElement('div');
    //     modalBody.className = 'modal-body';
    //     document.body.appendChild(modalBody);

    //     const collectionButton = document.createElement('button');
    //     collectionButton.id = 'collection-button';
    //     document.body.appendChild(collectionButton);

    //     // Call the function with incomplete data
    //     loadDetailsModal(incompleteData, true);

    //     // Assert the expected content in the modal for missing details
    //     expect(modalTitle.textContent).toBe('Incomplete Movie');
    //     expect(modalBody.innerHTML).toBe('<div>Details not available.</div>');
    // });

    // Add more test cases as needed
});
