import { Address } from "./address";

export interface Listing {
  id: number;
  title: string;
  price: number;
  listingType: string;
  status: string;
  publicationDate?: string | null;      // di solito le API restituiscono date come stringhe ISO
  endPublicationDate: string;
  description: string;
  area: number;
  numberRooms: number;
  propertyType: string;
  constructionYear: number;
  energyClass?: string;
  agencyId: number;
  agentId: number;
  Address: Address;
}