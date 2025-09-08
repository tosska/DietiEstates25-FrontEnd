export interface Address{

    formatted: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    unitDetail?: string;
    longitude?: number;
    latitude?: number;
    radiusKm?: number;

}

//cambiare nome in modo da non confondere con address.ts di listing-backend