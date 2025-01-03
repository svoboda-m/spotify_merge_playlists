import { fetchSpotifyUserProfile, fetchSpotifyUserPlaylists } from './endpoints.js';
import { setCheckboxOwned } from './ui.js';

let playlists = [];
let userData;
let id = 0;
let onlyUserOwned;

export async function fillPlaylists() {
    console.log('Filling Spotify playlists.');
    let fetchedData = await fetchSpotifyUserPlaylists();

    fetchedData.items.forEach(playlist => {
        addPlaylist(playlist.name, playlist.id, playlist.owner.uri);
    });
}

export async function fillUserData() {
    console.log('Filling Spotify user data.');
    let fetchedData = await fetchSpotifyUserProfile();
    userData = {name: fetchedData.display_name, spotifyID: fetchedData.id};
}

export function setDefaultValues() {
    setCheckboxOwned(true);
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
    if (onlyUserOwned) {
        return playlists.filter((playlist) => playlist.userOwned);
    } else {
        return playlists;
    }
}

export function getAllPlaylists() {
    return playlists;
}

export function getUserID() {
    return userData.spotifyID;
}

export function getUserName() {
    return userData.name;
}

export function toggleFilters(filters) {
    onlyUserOwned = filters.onlyUserOwned;
}

export function toggleSource(playlistID) {
    const playlist = getPlaylistByID(playlistID);
    let isSource = playlist.source;

    playlists[playlistID].source = !isSource;
}

export function toggleTarget(playlistID) {
    const playlist = getPlaylistByID(playlistID);
    let isTarget = playlist.target;

    playlists[playlistID].target = !isTarget;
}

function getPlaylistByID(id) {
    return playlists.find((playlist) => playlist.id === id) || null;
}
