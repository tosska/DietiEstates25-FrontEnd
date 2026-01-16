import { Address } from "./address";
import { Photo } from "./photo";

export interface Listing {
  id: number;
  title: string;
  price: number;
  listingType: string;
  status: string;
  publicationDate?: Date | null;      
  endPublicationDate?: Date | null;   
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
  Category?: string[];
}