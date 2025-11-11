export interface ListingResult {
    id: number;
    title: string;
    price: number;
    listing_type: string;
    status: string;
    publicationDate: string;
    endPublicationDate: string;
    agencyId: number;
    agentId: number;
    area: number;
    numberRooms: number;
    propertyType: string;
    constructionYear: number;
    energyClass: string;
    description: string;
    addressId: number;
    street: string;
    houseNumber: string;
    city: string;
    postalCode: string;
    state: string;
    unitDetail: string;
    longitude: number;
    latitude: number;
    country: string;
    mainPhoto: string;
}