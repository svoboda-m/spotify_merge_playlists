import config from './config.js';

const clientId = config.clientId;
const redirectUri = config.baseUri + config.redirectUri;

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

export async function redirectToSpotifyLogin() {
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