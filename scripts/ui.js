// This file handles all UI rendering
import { redirectToSpotifyLogin } from './login.js';

let callbacks = {};
const spotifyLoginBtn = document.getElementById('spotify-login');
const playlistsDiv = document.getElementById('playlists');
const checkboxOwned = document.getElementById('filter-owned');
const filtersDiv = document.getElementById('filters');


export function renderUI(playlists) {
    document.getElementById('spotify-login').style.display = 'none';
    showFilters();
    updatePlaylists(playlists);
}

export function renderLoginPage() {
    document.getElementById('spotify-login').style.display = 'block';

    spotifyLoginBtn.addEventListener("click", event => {
        redirectToSpotifyLogin();
    });
}

export function setCheckboxOwned(checked) {
    checkboxOwned.checked = checked;
    checkboxOwned.dispatchEvent(new Event('change'));
}

export function setupEventListneres(input) {
    callbacks = input;

    checkboxOwned.addEventListener('change', () => {
        callbacks.onFilterPlaylists({onlyUserOwned: checkboxOwned.checked});
    })
}

function showFilters() {
    const playlistsExists = callbacks.onGetPlaylists().length > 0;
    filtersDiv.style.display = playlistsExists ? 'flex' : 'none';
}

export function updatePlaylists(playlists) {    
    playlistsDiv.textContent = '';
    playlists.forEach((playlist) => {
        renderLine(playlist.name);
    });
}

function renderLine(playlistName) {
    let p = document.createElement('p');
    p.textContent = playlistName;
    playlistsDiv.appendChild(p);
}