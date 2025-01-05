import {
    fetchSpotifyUserProfile, 
    fetchSpotifyUserPlaylists,
    fetchPlaylistSongs,
    addTracksToPlaylist,
    deleteTracksFromPlaylist 
} from './endpoints.js';
import { renderUI, setCheckboxOwned, setMessage } from './ui.js';
import { testAPIConnection, tokenValidityCheck } from './tokens.js';

let playlists = [];
let sourcePlaylists = [];
let targetPlaylist;
let sourceSongs = [];
let existingSongs = [];
let loggedIn = false;
let userData;
let id = 0;
let onlyUserOwned;
const songLimitCount = 100; // count restricted by Spotify

function clearPlaylists() {
    console.log('Clearing data.');
    clearArray(sourceSongs);
    clearArray(existingSongs);
    clearArray(sourcePlaylists);
    clear(targetPlaylist);

    playlists.forEach(playlist => {
        playlist.source = false;
        playlist.target = false;
    });
}

export async function fillInitData() {
    try {
        await fillUserData();
        await fillPlaylists();
    } catch (error) {
        console.error('Error when filling init data.');
    }
}
export async function initApp() {
    console.log('Initializing application.');
    if(await testAPIConnection() && await tokenValidityCheck()){
        loggedIn = true;
        await fillInitData();
        setDefaultValues();
    }
    renderUI(loggedIn, getPlaylists());
}

async function fillPlaylists() {
    console.log('Filling out Spotify playlists.');
    const fetchedData = await fetchSpotifyUserPlaylists();

    fetchedData.items.forEach(playlist => {
        addPlaylist(playlist.name, playlist.id, playlist.owner.uri);
    });
}

async function fillUserData() {
    console.log('Filling out Spotify user data.');
    const fetchedData = await fetchSpotifyUserProfile();
    userData = {name: fetchedData.display_name, spotifyID: fetchedData.id};
}

export async function mergePlaylists() {
    console.log('Merging playlists.');

    if (!setSourcePlaylists()) {
        setMessage('source');
        return;
    }
    if (!setTargetPlaylist()) {
        setMessage('target');
        return;
    }

    try {
        await getSourceSongs();
        await getExistingSongs();
        await deleteExistingSongs();
        await postSongs();
    } catch (error) {
        console.error(error);
        setMessage('merge-fail');
    } finally {
        clearPlaylists();
    }

    setMessage('merge-success');
}

async function getSourceSongs() {
    console.log('Filling out song list.');
    
    for (const playlist of sourcePlaylists) {
        await getSongs(playlist, sourceSongs);
    }
}

async function getExistingSongs() {
    console.log('Filling out existing songs list.');
    await getSongs(targetPlaylist, existingSongs);
}

async function deleteExistingSongs() {
    const songsTotal = existingSongs.length;
    
    if (songsTotal > 0) {
        console.log('Deleting existing songs.');
        const numberOfRuns = Math.ceil(songsTotal / songLimitCount);
    
        for (let i = 0; i < numberOfRuns; i++) {
            let offset = 0 + (i*songLimitCount);
            let songsToDelete = existingSongs.slice(offset, offset + songLimitCount);
            await deleteTracksFromPlaylist(targetPlaylist, songsToDelete);
        }
    } else {
        console.log('Target playlist was already empty.');
    } 
}

async function getSongs(spotifyPlaylist, arrayPlaylist) {  
    let fetchedData;

    fetchedData = await fetchPlaylistSongs(spotifyPlaylist, 0, 1);
    const songsTotal = fetchedData.total;
    const numberOfRuns = Math.ceil(songsTotal / songLimitCount);

    for (let i = 0; i < numberOfRuns; i++) {
        let offset = 0 + (i*songLimitCount);
        fetchedData = await fetchPlaylistSongs(spotifyPlaylist, offset, songLimitCount);

        fetchedData.items.forEach(item => {
            arrayPlaylist.push(item.track.id);
        });  
    }

}

async function postSongs() {
    console.log('Posting songs.');
    
    const songsTotal = sourceSongs.length;
    const numberOfRuns = Math.ceil(songsTotal / songLimitCount);

    for (let i = 0; i < numberOfRuns; i++) {
        let offset = 0 + (i*songLimitCount);
        let songsToPush = sourceSongs.slice(offset, offset + songLimitCount);
        await addTracksToPlaylist(targetPlaylist, songsToPush);
    }    
}

function clearArray(playlist) {
    playlist = [];
}

function clear(playlist){
    playlist = '';
}

function setSourcePlaylists() {
    sourcePlaylists = playlists
                        .filter(playlist => playlist.source)
                        .map(playlist => playlist.spotifyID);

    if (sourcePlaylists.length == 0) {
        return false;
        //throw new Error('No sources found.');
    }

    return true;
}

function setTargetPlaylist() {
    const playlistAsTarget = playlists.find(playlist => playlist.target) || null;

    if (playlistAsTarget != null) {
        targetPlaylist = playlistAsTarget.spotifyID;
        return true;
    } //else {
        
        // throw new Error('Target not found.');
    //}   
    
    return false;
}

export function setDefaultValues() {
    setCheckboxOwned(true);
    onlyUserOwned = true;
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
    const wasTarget = playlist.target;
    const wasSource = playlist.source; 

    if (wasTarget) {
        playlist.target = false;
    }

    playlists[playlistID].source = !wasSource;
}

export function toggleTarget(playlistID) {
    const playlist = getPlaylistByID(playlistID);
    const wasTarget = playlist.target;
    const wasSource = playlist.source; 

    if (!wasTarget) {
        playlists.forEach(playlist => {
            playlist.target = false;
        });
    }

    if (wasSource) {
        playlist.source = false;
    }

    playlists[playlistID].target = !wasTarget;
}

function getPlaylistByID(id) {
    return playlists.find((playlist) => playlist.id === id) || null;
}
