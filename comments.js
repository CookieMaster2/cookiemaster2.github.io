export function addComment(movieTitle, commentTitle, commentText, commentRating) {

    const existingComments = JSON.parse(localStorage.getItem('movieComments')) || [];

    // Add the new comment to the array
    existingComments.push({
        movieTitle: movieTitle,
        commentTitle: commentTitle,
        commentText: commentText,
        commentRating: commentRating
    });

    // Save the updated comments array back to local storage
    localStorage.setItem('movieComments', JSON.stringify(existingComments));


    const comment = {
        movieTitle,
        commentTitle,
        commentText,
        commentRating,
    };

    // Add your logic to store or display the comment
    // For example, update the UI or store the comment in local storage
    console.log('Comment added:', comment);
}

// module.exports = { addComment }