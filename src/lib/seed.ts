export enum SeedType {
    Genre,
    Track,
    Artist
}

export interface Seed {
    type: SeedType,
    id: string
}