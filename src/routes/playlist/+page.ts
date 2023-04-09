import { browser } from '$app/environment';
import { getUser } from '$lib/spotifyApi.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
    if(browser) {
        let accessToken = localStorage.getItem('access-token');
        if(!accessToken) {
            redirect(302, '/playlist/login');
        }
        else {
            let user = await getUser();
            return {
                user: user
            }
        }
    }
}