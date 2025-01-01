import config from './config.js';

const clientId = config.clientId;
const redirectUri = config.baseUri + config.redirectUri;

document.addEventListener('DOMContentLoaded', async () => {
    await handleSpotifyCallback();
    window.location.href = config.baseUri + config.mainUri;
});

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