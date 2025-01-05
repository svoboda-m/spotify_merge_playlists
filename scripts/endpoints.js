// This file contains all API endpoints

// This function executes fetching test
export async function fetchTest() {
    const accessToken = window.localStorage.getItem('access_token');

    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) throw new Error('Fetch test failed.');
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
        throw new Error('Error fetching Spotify user data.');
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
        console.error('Error fetching Spotify user playlists:', await response.json());
        throw new Error('Error fetching Spotify user playlists.');
    }
}

// This function fetches all songs from defined playlist
export async function fetchPlaylistSongs(spotifyID, offset, limit) {
    const accessToken = window.localStorage.getItem('access_token');
    if (!accessToken) {
        console.error('Access token not found. Please log in.');
        return;
    }

    const response = await fetch(`https://api.spotify.com/v1/playlists/${spotifyID}/tracks?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });


    if (response.ok) {
        const playlistSongs = await response.json();
        return playlistSongs;
    } else {
        console.error('Error fetching playlist songs:', await response.json());
        throw new Error('Error fetching playlist songs.');
    }
}

// This function adds songs to existed playlist
export async function addTracksToPlaylist(playlistId, trackIds) {
    const accessToken = window.localStorage.getItem('access_token');
    if (!accessToken) {
        console.error('Access token not found. Please log in.');
        return;
    }

    
    const trackUris = trackIds.map(id => `spotify:track:${id}`);
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uris: trackUris,
            }),
        });

        if (response.ok) {
            console.log('Tracks added successfully!');
        } else {
            const errorData = await response.json();
            console.error('Error adding tracks to playlist:', errorData);
            throw new Error('Error adding tracks to playlist.');
        }
    } catch (error) {
        console.error('Network or API error:', error);
        throw new Error('Network or API error.');
    }
}

// This function deletes songs from source playlist
export async function deleteTracksFromPlaylist(playlistId, trackIds) {
    const accessToken = window.localStorage.getItem('access_token');
    if (!accessToken) {
        console.error('Access token not found. Please log in.');
        return;
    }
    
    const tracks = trackIds.map(id => ({uri: `spotify:track:${id}`}));
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tracks: tracks,
            }),
        });

        if (response.ok) {
            console.log('Tracks deleted successfully!');
        } else {
            const errorData = await response.json();
            console.error('Error deleting tracks from playlist:', errorData);
            throw new Error('Error deleting tracks from playlist.');
        }
    } catch (error) {
        console.error('Network or API error:', error);
        throw new Error('Network or API error.');
    }
}