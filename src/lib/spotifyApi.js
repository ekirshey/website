import { PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI } from '$env/static/public'

// @ts-ignore
export async function requestAccessToken(code) {
    let codeVerifier = localStorage.getItem('code-verifier');

    // @ts-ignore
    let body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: PUBLIC_REDIRECT_URI,
        client_id: PUBLIC_CLIENT_ID,
        code_verifier: codeVerifier
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })

    localStorage.setItem('access-token', response.access_token);
}

// @ts-ignore
export async function refreshAccessToken() {
    let token = localStorage.getItem('access-token');

    // @ts-ignore
    let body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token,
        client_id: PUBLIC_CLIENT_ID,
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })

    localStorage.setItem('access-token', response.access_token);
}