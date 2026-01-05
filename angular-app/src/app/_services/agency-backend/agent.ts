export interface Agent {
  id: number;
  name?: string | null;
  surname?: string | null;
  urlPhoto?: string | null;
  phone?: string | null;
  vatNumber?: string | null;
  yearsExperience?: number | null;
  agencyId: number;
  creatorAdminId: number;
  
}

