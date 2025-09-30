import { Address } from "./address";
import { Photo } from "./photo";

export interface Listing {
  id: number;
  title: string;
  price: number;
  listingType: string;
  status: string;
  publicationDate?: Date | null;      // di solito le API restituiscono date come stringhe ISO
  endPublicationDate: Date;
  description: string;
  area: number;
  numberRooms: number;
  propertyType: string;
  constructionYear: number;
  energyClass?: string;
  agencyId: number;
  agentId: number;
  Address: Address;
  Photos?: Photo[];
}