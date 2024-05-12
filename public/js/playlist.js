// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Add event listeners to the scroll buttons for popular songs
    const leftScroll = document.getElementById("left_scroll");
    const rightScroll = document.getElementById("right_scroll");
    if (leftScroll && rightScroll) {
        leftScroll.addEventListener("click", scrollPopularSongsLeft);
        rightScroll.addEventListener("click", scrollPopularSongsRight);
    }
});

// Function to scroll popular songs container to the left
function scrollPopularSongsLeft() {
    const popSongContainer = document.querySelector(".pop_song");
    popSongContainer.scrollBy({
        left: -200, // adjust the scrolling distance as needed
        behavior: "smooth"
    });
}

// Function to scroll popular songs container to the right
function scrollPopularSongsRight() {
    const popSongContainer = document.querySelector(".pop_song");
    popSongContainer.scrollBy({
        left: 200, // adjust the scrolling distance as needed
        behavior: "smooth"
    });
}

// Add event listeners to the scroll buttons for Popular Artists
document.getElementById("left_scroll2").addEventListener("click", scrollPopularArtistsLeft);
document.getElementById("right_scroll2").addEventListener("click", scrollPopularArtistsRight);

// Function to scroll popular artists container to the left
function scrollPopularArtistsLeft() {
    const popularArtistsContainer = document.querySelector(".popular_artists .item");
    popularArtistsContainer.scrollBy({
        left: -200, // adjust the scrolling distance as needed
        behavior: "smooth"
    });
}

// Function to scroll popular artists container to the right
function scrollPopularArtistsRight() {
    const popularArtistsContainer = document.querySelector(".popular_artists .item");
    popularArtistsContainer.scrollBy({
        left: 200, // adjust the scrolling distance as needed
        behavior: "smooth"
    });
}

// Add event listeners to the scroll buttons for Recommended Songs
document.getElementById("left_scroll3").addEventListener("click", scrollRecommendedSongsLeft);
document.getElementById("right_scroll3").addEventListener("click", scrollRecommendedSongsRight);

// Function to scroll recommended songs container to the left
function scrollRecommendedSongsLeft() {
    const recommendedSongsContainer = document.querySelector(".recommended_songs");
    recommendedSongsContainer.scrollBy({
        left: -200, // adjust the scrolling distance as needed
        behavior: "smooth"
    });
}

// Function to scroll recommended songs container to the right
function scrollRecommendedSongsRight() {
    const recommendedSongsContainer = document.querySelector(".recommended_songs");
    recommendedSongsContainer.scrollBy({
        left: 200, // adjust the scrolling distance as needed
        behavior: "smooth"
    });
}