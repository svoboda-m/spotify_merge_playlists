import { redirectToSpotifyLogin } from './login.js';
import { fetchSpotifyUserProfile, fetchSpotifyUserPlaylists } from './endpoints.js';
import { renderPlaylists } from './ui.js';
let userData;
let playlists;
let listOnlyUserOwned = true;

console.log('access_token: ' + window.localStorage.getItem('access_token'));
console.log('refresh_token: ' + window.localStorage.getItem('refresh_token'));

if (window.localStorage.getItem('access_token') != null) {
    document.getElementById('spotify-login').style.display = 'none';
        
    userData = await fetchSpotifyUserProfile();
    playlists = await fetchSpotifyUserPlaylists();

    renderPlaylists(playlists, userData.id, listOnlyUserOwned);
} else {
    document.getElementById('spotify-login').style.display = 'block';
    const spotifyLogin = document.getElementById('spotify-login');

    spotifyLogin.addEventListener("click", event => {
        redirectToSpotifyLogin();
    });
}

// const filterCheckbox = document.getElementById('filter-owned');

// filterCheckbox.addEventListener('change', function() {
//     if (this.checked) {
//         console.log('checked');
//         console.log(this.checked);
//     } else {
//         console.log('unchecked');
//         console.log(this.checked);
//     }

//     renderPlaylists(playlists, userData.id, this.checked);
// });