export interface LocationRequest{

    formatted: string;
    street?: string;
    housenumber?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    unitDetail?: string;
    longitude?: number;
    latitude?: number;
    radiusKm?: number;
    idPlace?: string;

}

//cambiare nome in modo da non confondere con address.ts di listing-backend