const spotifyLogin = document.querySelector("#spotify-login");
const clientId = '891fdb069afc487993e49bca313005e6';
import config from './config.js';
const redirectUri = config.baseUri + '/spotify.html';

spotifyLogin.addEventListener("click", event => {
    console.log("button clicked");
    redirectToSpotifyLogin();
})

document.addEventListener('DOMContentLoaded', async () => {
    await handleSpotifyCallback();
    await fetchSpotifyUserProfile();
});



// Spotify Docs implementation
function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
}

function base64encode(input) {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
}

async function generateCodeChallenge(verifier) {
    const hashed = await sha256(verifier);
    return base64encode(hashed);
}

async function redirectToSpotifyLogin() {
    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    console.log("codeVerifier: " + codeVerifier);
    console.log("codeChallenge: " + codeChallenge);

    

    const scopes = 'user-read-private user-read-email';
    const authUrl = new URL("https://accounts.spotify.com/authorize")

    window.localStorage.setItem('code_verifier', codeVerifier);

    const params =  {
        response_type: 'code',
        client_id: clientId,
        scope: scopes,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri
    }

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}


// Step 2: Handle Spotify redirect and get the authorization code
async function handleSpotifyCallback() {
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');

    if (!authorizationCode) {
        console.error('Authorization code not found in the callback.');
        return;
    }

    const codeVerifier = window.localStorage.getItem('code_verifier');
    if (!codeVerifier) {
        console.error('Code verifier not found in storage.');
        return;
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: authorizationCode,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier
        })
    });

    const tokenData = await tokenResponse.json();

    if (tokenResponse.ok) {
        console.log('Access Token:', tokenData.access_token);
        console.log('Refresh Token:', tokenData.refresh_token);
        // Save tokens for further API calls
        window.localStorage.setItem('access_token', tokenData.access_token);
        window.localStorage.setItem('refresh_token', tokenData.refresh_token);
    } else {
        console.error('Error fetching access token:', tokenData);
    }
}

// Step 3: Use access token for Spotify API calls
async function fetchSpotifyUserProfile() {
    const accessToken = window.localStorage.getItem('access_token');
    if (!accessToken) {
        console.error('Access token not found. Please log in.');
        return;
    }

    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.ok) {
        const userData = await response.json();
        console.log('Spotify User Data:', userData);
    } else {
        console.error('Error fetching Spotify user data:', await response.json());
    }
}


