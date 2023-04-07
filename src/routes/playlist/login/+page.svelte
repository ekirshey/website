<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { clientId, redirectUri, requestAccessToken } from "../../../spotifyApi";


    /** @param {number} length */
    function generateRandomString(length) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /** @param {string | undefined} codeVerifier */
    async function generateCodeChallenge(codeVerifier) {

        // @ts-ignore
        function base64encode(string) {
            var str = "";
            var bytes = new Uint8Array(string);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                str += String.fromCharCode(bytes[i]);
            }
            return btoa(str)
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);

        return base64encode(digest);
    }

    function getCode() {
        let codeVerifier = generateRandomString(128);

        generateCodeChallenge(codeVerifier).then(codeChallenge => {
            let state = generateRandomString(16);
            let scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public';

            localStorage.setItem('code-verifier', codeVerifier);
            let args = new URLSearchParams({
                response_type: 'code',
                client_id: clientId,
                scope: scope,
                redirect_uri: redirectUri,
                state: state,
                code_challenge_method: 'S256',
                code_challenge: codeChallenge
            });

            // @ts-ignore
            window.location = 'https://accounts.spotify.com/authorize?' + args;
        });
    }

	onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('code');
        if(code) {
            await requestAccessToken(code);
            goto('/playlist');
        }
	});

</script>

<h1>Login</h1>
<button on:click={getCode}>
    Connect
</button>