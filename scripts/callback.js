// This file handles login callback, stores tokens and refreshes them
import config from './config.js';

const clientId = config.clientId;
const redirectUri = config.baseUri + config.redirectUri;

document.addEventListener('DOMContentLoaded', async () => {
    await handleSpotifyCallback();
    window.location.href = config.baseUri + config.mainUri;
});

// This function handles Spotify login callback
async function handleSpotifyCallback() {
    // Extract authorization code
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
    console.log(tokenData);

    if (tokenResponse.ok) {
        await handleTokens(tokenData.access_token, tokenData.refresh_token, tokenData.expires_in)
    } else {
        console.error('Error fetching access token:', tokenData);
    }
}

// This function stores access and refresh tokens to localStorage and calls scheduling token refresh
async function handleTokens(accessToken, refreshToken, expiresIn) {
    window.localStorage.setItem('access_token', accessToken);
    window.localStorage.setItem('refresh_token', refreshToken);

    scheduleTokenRefresh(expiresIn, refreshToken);
}

// This function schedules token refresh
function scheduleTokenRefresh(expiresInSeconds, refreshToken) {
    const refreshTime = (expiresInSeconds - 60) * 1000; // Refresh 1 minute before expiry
    console.log('scheduling token refresh in ' + refreshTime);

    setTimeout(async () => {
        try {
            await refreshAccessToken(refreshToken);
            console.log('Token refreshed successfully.');
        } catch (error) {
            console.error('Failed to refresh token:', error);
        }
    }, refreshTime);
}

// This function executes token refresh via calling API
export async function refreshAccessToken(refreshToken) {
    console.log('refreshing token');
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
        }),
    });

    const data = await response.json();
    if (data.access_token) {
        window.localStorage.setItem('access_token', data.access_token);
        return data.access_token;
    } else {
        console.error('Error refreshing access token:', data);
        throw new Error('Could not refresh token');
    }
}