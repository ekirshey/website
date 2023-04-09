export enum SeedType {
    Genre,
    Track,
    Artist
}

export interface Seed {
    type: SeedType,
    id: string
}

export interface Property {
    name : string,
    integer : boolean,
    min? : number,
    max? : number,
    value: number
}

export const availableProperties : Property[] = [
    { name: "limit", integer: true, min: 1, max: 100, value: 0 },
    { name: "min_acousticness", integer: false, min: 0, max: 1, value: 0 },
    { name: "max_acousticness", integer: false, min: 0, max: 1, value: 0 },
    { name: "target_acousticness", integer: false, min: 0, max: 1, value: 0 },
    { name: "min_danceability", integer: false, min: 0, max: 1, value: 0 },
    { name: "max_danceability", integer: false, min: 0, max: 1, value: 0 },
    { name: "target_danceability", integer: false, min: 0, max: 1, value: 0 },
    { name: "min_duration_ms", integer: true, value: 0 },
    { name: "max_duration_ms", integer: true, value: 0 },
    { name: "target_duration_ms", integer: true, value: 0 },
    { name: "min_energy", integer: false, min: 0, max: 1, value: 0 },
    { name: "max_energy", integer: false, min: 0, max: 1, value: 0},
    { name: "target_energy", integer: false, min: 0, max: 1, value: 0 },
    { name: "min_instrumentalness", integer: false, min: 0, max: 1, value: 0 },
    { name: "max_instrumentalness", integer: false, min: 0, max: 1, value: 0 },
    { name: "target_instrumentalness", integer: false, min: 0, max: 1, value: 0 },
    { name: "min_key", integer: true, min: 0, max: 11, value: 0 },
    { name: "max_key", integer: true, min: 0, max: 11, value: 0 },
    { name: "target_key", integer: true, min: 0, max: 11, value: 0 },
    { name: "min_liveness", integer: false, min: 0, max: 1, value: 0 },
    { name: "max_liveness", integer: false, min: 0, max: 1, value: 0 },
    { name: "target_liveness", integer: false, min: 0, max: 1, value: 0 },
    { name: "min_loudness", integer: false, value: 0 },
    { name: "max_loudness", integer: false, value: 0 },
    { name: "target_loudness", integer: false, value: 0 },
    { name: "min_mode", integer: true, min: 0, max: 1, value: 0 },
    { name: "max_mode", integer: true, min: 0, max: 1, value: 0 },
    { name: "target_mode", integer: true, min: 0, max: 1, value: 0 },
    { name: "min_popularity", integer: true, min: 0, max: 100, value: 0 },
    { name: "max_popularity", integer: true, min: 0, max: 100, value: 0 },
    { name: "target_popularity", integer: true, min: 0, max: 100, value: 0 },
    { name: "min_speechiness", integer: false, min: 0, max: 1, value: 0 },
    { name: "max_speechiness", integer: false, min: 0, max: 1, value: 0 },
    { name: "target_speechiness", integer: false, min: 0, max: 1, value: 0 },
    { name: "min_tempo", integer: false, value: 0 },
    { name: "max_tempo", integer: false, value: 0 },
    { name: "target_tempo", integer: false, value: 0 },
    { name: "min_time_signature", integer: true, max: 11, value: 0 },
    { name: "max_time_signature", integer: true, value: 0 },
    { name: "target_time_signature", integer: true, value: 0 },
    { name: "min_valence", integer: false, min: 0, max: 1, value: 0 },
    { name: "max_valence", integer: false, min: 0, max: 1, value: 0 },
    { name: "target_valence", integer: false, min: 0, max: 1, value: 0 }
];