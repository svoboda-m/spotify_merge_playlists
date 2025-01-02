import { fetchSpotifyUserProfile, fetchSpotifyUserPlaylists } from './endpoints.js';

let playlists = [];
let userData;
let id = 0;

export async function fillPlaylists() {
    console.log('Filling Spotify playlists.');
    let fetchedData = await fetchSpotifyUserPlaylists();

    fetchedData.items.forEach(playlist => {
        addPlaylist(playlist.name, playlist.id, playlist.owner.uri);
    });
}

function addPlaylist(playlistName, spotifyID, ownerURI) {
    playlists.push({id: String(id++), 
        name: playlistName,
        spotifyID: spotifyID,
        userOwned: (ownerURI.includes(getUserID())),
        source: false,
        target: false});
}

export function getPlaylists() {
    return playlists;
}

export async function fillUserData() {
    console.log('Filling Spotify user data.');
    let fetchedData = await fetchSpotifyUserProfile();
    userData = {name: fetchedData.display_name, spotifyID: fetchedData.id};
}

export function getUserID() {
    return userData.spotifyID;
}

export function getUserName() {
    return userData.name;
}

