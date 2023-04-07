export const clientId = '64241a4ce1ce4f5f991b1c257ce0890b';
export const redirectUri ='https://www.ekirshey.com/playlist/login'
//export const redirectUri ='http://localhost:5173/playlist/login'


// @ts-ignore
export async function requestAccessToken(code) {
    let codeVerifier = localStorage.getItem('code-verifier');

    // @ts-ignore
    let body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
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
        client_id: clientId,
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