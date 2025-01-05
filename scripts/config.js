const config = {
    baseUri: window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://svoboda-martin.cz',
    clientId: '891fdb069afc487993e49bca313005e6',
    scopes: 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private',
    mainUri: '/spotify.html',
    redirectUri: '/callback.html'
};

export default config;