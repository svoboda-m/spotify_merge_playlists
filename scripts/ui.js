// This file handles all UI rendering
import { redirectToSpotifyLogin } from './login.js';

let callbacks = {};
const spotifyLoginBtn = document.getElementById('spotify-login');
const playlistUl = document.getElementById('playlists');
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
}

function showFilters() {
    const playlistsExists = callbacks.onGetAllPlaylists().length > 0;
    filtersDiv.style.display = playlistsExists ? 'flex' : 'none';
}

export function updatePlaylists(playlists) {    
    playlistUl.textContent = '';

    playlists.forEach((playlist) => {
        renderLine(playlist);
    });
}

function renderLine(playlist) {
    // let li = document.createElement('li');
    // li.textContent = playlist.name;
    // playlistUl.appendChild(li);

    playlistUl.innerHTML += 
    `<li class="playlist-item" data-id="${playlist.id}">
        <span>${playlist.name}</span>
        <div>
            <button class="source-btn">${playlist.source ? 'Source' : 'notSource'}</button>
            <button class="target-btn">${playlist.target ? 'Target' : 'notTarget'}</button>
        </div>
    </li>`;
}