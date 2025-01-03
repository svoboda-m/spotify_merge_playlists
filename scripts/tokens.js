import config from './config.js';
import { fetchTest } from './endpoints.js';

const clientId = config.clientId;

export async function testAPIConnection() {
    console.log('Testing API connection.');
    if (window.localStorage.getItem('access_token') == null) {
        console.log('API access token not exists.');
        return false;
    }

    try {
        await fetchTest();
    } catch (error) {
        console.log(error);
        return false;
    }

    return true;
}

export async function tokenValidityCheck() {
    const expiresAt = window.localStorage.getItem('expires_at');
    const expireTime = expiresAt - Date.now();
    // const refreshTime = 300000; // 5 minutes
    const refreshTime = 3500000; // 5 minutes

    console.log('Expire Time: ' + expireTime);
    if (expireTime < refreshTime) {
        return await refreshAccessToken();
    }
    return true;
}

// This function executes token refresh via calling API
async function refreshAccessToken() {
    console.log('Refreshing token.');
    const refreshToken = window.localStorage.getItem('refresh_token');
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
    if (data.access_token && data.expires_in) {
        window.localStorage.setItem('access_token', data.access_token);
        window.localStorage.setItem('expires_at', Date.now() + (data.expires_in*1000));
        return true;
    } else {
        console.error('Error refreshing access token:', data);
        return false;
    }
}

// This function stores access and refresh tokens to localStorage and calls scheduling token refresh
export async function handleTokens(accessToken, refreshToken, expiresIn) {
    window.localStorage.setItem('access_token', accessToken);
    window.localStorage.setItem('refresh_token', refreshToken);
    window.localStorage.setItem('expires_at', Date.now() + (expiresIn*1000));

    //scheduleTokenRefresh(expiresIn, refreshToken);
}

// This function schedules token refresh
function scheduleTokenRefresh(expiresInSeconds, refreshToken) {
    const refreshTime = (expiresInSeconds - 60) * 1000; // Refresh 1 minute before expiry

    setTimeout(async () => {
        try {
            await refreshAccessToken(refreshToken);
            console.log('Token refreshed successfully.');
        } catch (error) {
            console.error('Failed to refresh token:', error);
        }
    }, refreshTime);
}