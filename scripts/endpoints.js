// This file contains all API endpoints

// This function executes fetching test
export async function fetchTest() {
    const accessToken = window.localStorage.getItem('access_token');

    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) throw new Error("Fetch test failed.");
}

// This function fetches Spotify user profile details
export async function fetchSpotifyUserProfile() {
    const accessToken = window.localStorage.getItem('access_token');
    if (!accessToken) {
        console.error('Access token not found. Please log in.');
        return;
    }

    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.ok) {
        const userData = await response.json();
        return userData;
    } else {
        console.error('Error fetching Spotify user data:', await response.json());
    }
}

// This function fetches Spotify user's playlists
export async function fetchSpotifyUserPlaylists() {
    const accessToken = window.localStorage.getItem('access_token');
    if (!accessToken) {
        console.error('Access token not found. Please log in.');
        return;
    }

    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.ok) {
        const userPlaylists = await response.json();
        return userPlaylists;
    } else {
        console.error('Error fetching Spotify user data:', await response.json());
    }
}