import 'jest-localstorage-mock';
import { addComment } from '../comments.js';

// Mock console.log
console.log = jest.fn();

beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
});

test('should add a new comment to localStorage', () => {
    addComment('Movie 2', 'New Comment', 'Another comment.', 4);

    expect(localStorage.getItem).toHaveBeenCalledWith('movieComments');
    expect(localStorage.setItem).toHaveBeenCalledWith(
        'movieComments',
        expect.any(String)
    );
    expect(console.log).toHaveBeenCalledWith('Comment added:', {
        movieTitle: 'Movie 2',
        commentTitle: 'New Comment',
        commentText: 'Another comment.',
        commentRating: 4,
    });
});

test('should handle adding a comment when localStorage is empty', () => {
    // Simulate an empty localStorage
    expect(localStorage.getItem('movieComments')).toBeNull();

    addComment('Movie 2', 'New Comment', 'Another comment.', 4);

    expect(localStorage.getItem).toHaveBeenCalledWith('movieComments');
    expect(localStorage.setItem).toHaveBeenCalledWith(
        'movieComments',
        expect.any(String)
    );
    expect(console.log).toHaveBeenCalledWith('Comment added:', {
        movieTitle: 'Movie 2',
        commentTitle: 'New Comment',
        commentText: 'Another comment.',
        commentRating: 4,
    });
});

test('should handle adding a comment when localStorage has existing comments', () => {
    // Simulate existing comments in localStorage
    localStorage.setItem('movieComments', JSON.stringify([
        {
            movieTitle: 'Existing Movie',
            commentTitle: 'Existing Comment',
            commentText: 'This is an existing comment.',
            commentRating: 5,
        },
    ]));

    addComment('Movie 2', 'New Comment', 'Another comment.', 4);

    expect(localStorage.getItem).toHaveBeenCalledWith('movieComments');
    expect(localStorage.setItem).toHaveBeenCalledWith(
        'movieComments',
        expect.any(String)
    );
    expect(console.log).toHaveBeenCalledWith('Comment added:', {
        movieTitle: 'Movie 2',
        commentTitle: 'New Comment',
        commentText: 'Another comment.',
        commentRating: 4,
    });
});

// Add more test cases as needed
