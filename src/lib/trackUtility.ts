import type { Artist, SimplifiedArtist } from "spotify-types";

export function getArtistsName(artist : Artist[]) {
    return artist.map(a => a.name);
}

export function getSimplifiedArtistsName(artist : SimplifiedArtist[]) {
    return artist.map(a => a.name);
}