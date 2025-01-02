// This file handles all UI rendering
import { redirectToSpotifyLogin } from './login.js';

let listOnlyUserOwned = true;

export function renderUI(playlists) {
    renderFilters();
    updatePlaylists(playlists, listOnlyUserOwned);
}

function renderFilters() {
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.id = 'filter-owned';
    input.checked = listOnlyUserOwned;
    document.getElementById('filters').appendChild(input);

    let label = document.createElement("label");
    label.textContent = 'Zobraz pouze vlastní playlisty';
    label.setAttribute('for', 'filter-owned');
    document.getElementById('filters').appendChild(label);

    const filterCheckbox = document.getElementById('filter-owned');

    filterCheckbox.addEventListener('change', function() {
    if (this.checked) {
        console.log('checked');
        console.log(this.checked);

    } else {
        console.log('unchecked');
        console.log(this.checked);
    }
    listOnlyUserOwned = this.checked;
    // TODO: zajistit moznost volani updatePlaylists(), potreba udelat podle ToDo app
    });
}

function updatePlaylists(playlists, listOnlyUserOwned) {    
    document.getElementById('playlists').textContent = '';
    playlists.forEach((playlist) => {
        if (listOnlyUserOwned && playlist.userOwned) {
                renderLine(playlist.name);
        }
        else if (!listOnlyUserOwned) {
            renderLine(playlist.name);
        }
    });
}

function renderLine(playlistName) {
    let p = document.createElement('p');
    p.textContent = playlistName;
    document.getElementById('playlists').appendChild(p);
}

export function renderLoginPage() {
    document.getElementById('spotify-login').style.display = 'block';
    const spotifyLogin = document.getElementById('spotify-login');

    spotifyLogin.addEventListener("click", event => {
        redirectToSpotifyLogin();
    });
}