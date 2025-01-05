// This file handles all UI rendering
import { redirectToSpotifyLogin } from './login.js';

let callbacks = {};
const spotifyLogin = document.getElementById('spotify-login');
const spotifyLoginBtn = document.getElementById('login-btn');
const playlistUl = document.getElementById('playlists');
const checkboxOwned = document.getElementById('filter-owned');
const filtersDiv = document.getElementById('filters');
const mergePlaylistsBtn = document.getElementById('merge-playlists-btn');
const messageDiv = document.getElementById('message-div');
const messageText = document.getElementById('message-text');
const clearMessageBtn = document.getElementById('clear-message');


export function renderUI(loggedIn, playlists) {
    spotifyLogin.style.display = loggedIn ? 'none' : 'flex';
    showFilters();
    showMergeBtn()
    updatePlaylists(playlists);
}

spotifyLoginBtn.addEventListener("click", event => {
    redirectToSpotifyLogin();
});

export function setMessage(inputText) {
    let text = '';
    switch (inputText) {
        case 'source':
            text = 'Nebyl vybrán žádný zdrojový seznam skladeb.';
            break;
        case 'target':
            text = 'Nebyl vybrán cílový seznam skladeb.';
            break;
        case 'merge-success':
            text = 'Sloučení seznamů skladeb úspěšně provedeno.';
            break;
        case 'merge-fail':
            text = 'Sloučení seznamů skladeb se nezdařilo.';
            break;
    
        default:
            break;
    }
    messageText.textContent = text;
    messageDiv.style.display = 'flex';
}

export function setCheckboxOwned(checked) {
    checkboxOwned.checked = checked;
}

clearMessageBtn.addEventListener('click', event => {
    messageDiv.style.display = 'none';
})

export function setupEventListeneres(input) {
    console.log('Setting up event listeners.');
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
        callbacks.onMergePlaylists();
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