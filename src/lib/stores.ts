import type { Artist, Track } from 'spotify-types';
import { writable, type Writable } from 'svelte/store';
import type { Seed } from './seed';

export const sourceTracks : Writable<Track[]> = writable([]);
export const sourceArtists : Writable<Artist[]> = writable([]);
export const sourceGenres : Writable<string[]> = writable([]);

export const seeds : Writable<Seed[]> = writable([]);