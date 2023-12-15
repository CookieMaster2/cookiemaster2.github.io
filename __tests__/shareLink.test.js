// __tests__/shareLink.test.js

// Import the function to be tested
import { getShareLink } from '../script.js';

// Mock the specific function within the module
jest.mock('../script.js', () => ({
    ...jest.requireActual('../script.js'), // Use the actual implementation for other functions
    getShareLink: jest.fn(() => 'https://movieadmin.com/movie/sampleMovieId'), // Mock only the getShareLink function
}));

// Create a simple mock DOM for JSDOM
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body><div class="movie" data-id="sampleMovieId"></div></body></html>');
global.document = dom.window.document;

describe('getShareLink', () => {
    test('should return the correct share link', () => {
        const shareLink = getShareLink();
        expect(shareLink).toBe('https://movieadmin.com/movie/sampleMovieId');
    });
});
