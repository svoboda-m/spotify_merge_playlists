import { redirectToSpotifyLogin } from './login.js';
import { fetchSpotifyUserProfile, fetchSpotifyUserPlaylists } from './endpoints.js';
let userData;
let playlists;
let listOnlyUserOwned = true;

console.log('access_token: ' + window.localStorage.getItem('access_token'));
console.log('refresh_token: ' + window.localStorage.getItem('refresh_token'));

if (window.localStorage.getItem('access_token')) {
    document.getElementById('spotify-login').style.display = 'none';
        
    userData = await fetchSpotifyUserProfile();
    playlists = await fetchSpotifyUserPlaylists();

    console.log(playlists);
    console.log('Playlists:');
    playlists.items.forEach(playlist => {
        if (listOnlyUserOwned) {
            if (playlist.owner.uri.includes(userData.id)) {
                console.log(playlist.name);
            }
        }
        else {
            console.log(playlist.name);
        }
    });
} else {
    document.getElementById('spotify-login').style.display = 'block';
    const spotifyLogin = document.querySelector('#spotify-login');

    spotifyLogin.addEventListener("click", event => {
        console.log("button clicked");
        redirectToSpotifyLogin();
    })
}