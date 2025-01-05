// This file handles all UI rendering
import { redirectToSpotifyLogin } from './login.js';

let callbacks = {};
const spotifyLoginBtn = document.getElementById('spotify-login');
const playlistUl = document.getElementById('playlists');
const checkboxOwned = document.getElementById('filter-owned');
const filtersDiv = document.getElementById('filters');
const mergePlaylistsBtn = document.getElementById('merge-playlists-btn');


export function renderUI(playlists) {
    document.getElementById('spotify-login').style.display = 'none';
    showFilters();
    showMergeBtn()
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
}

export function setupEventListeneres(input) {
    callbacks = input;

    checkboxOwned.addEventListener('change', () => {
        callbacks.onToggleFilters({onlyUserOwned: checkboxOwned.checked});
    })

    playlistUl.addEventListener('click', (event) => {
        const target = event.target;
        const playlistID = target.closest('li')?.dataset.id;

        if (target.classList.contains('source-btn')) {
            callbacks.onToggleSource(playlistID);
        }

        if (target.classList.contains('target-btn')) {
            callbacks.onToggleTarget(playlistID);
        }
    })

    mergePlaylistsBtn.addEventListener('click', event => {
        callbacks.onMergePlaylists().then(result => {
            if (result) {
                console.log('Merge sucessful.');
            } else {
                console.log('Merge failed.');
            }});
    })
}

function showFilters() {
    const playlistsExists = callbacks.onGetAllPlaylists().length > 0;
    filtersDiv.style.display = playlistsExists ? 'flex' : 'none';
}

function showMergeBtn() {
    const playlistsExists = callbacks.onGetAllPlaylists().length > 0;
    mergePlaylistsBtn.style.display = playlistsExists ? 'flex' : 'none';
}

export function updatePlaylists(playlists) {    
    console.log('Rendering playlists list.');
    playlistUl.textContent = '';

    playlists.forEach((playlist) => {
        renderLine(playlist);
    });
}

function renderLine(playlist) {
    playlistUl.innerHTML += 
    `<li class="playlist-item" data-id="${playlist.id}">
        <span>${playlist.name}</span>
        <div>
            <button class="source-btn">${playlist.source ? 'Source' : 'notSource'}</button>
            <button class="target-btn">${playlist.target ? 'Target' : 'notTarget'}</button>
        </div>
    </li>`;
}