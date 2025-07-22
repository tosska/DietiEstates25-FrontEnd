export interface SearchRequest {

    listing_type?: string;
    number_rooms?: number;
    min_area?: number;
    max_area?: number;
    min_price?: number;
    max_price?: number;
    construction_year_before?: number;
    construction_year_after?: number;
    energyClass?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    state?: string;
    unitDetail?: string;
    longitude?: number;
    latitude?: number;

}
