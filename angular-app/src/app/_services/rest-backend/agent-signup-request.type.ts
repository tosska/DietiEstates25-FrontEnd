// agency-signup-request.type.ts
export interface AgentSignupRequest {
  name?: string;
  surname?: string;
  phone?: string;
  email: string;
  password: string;
  vatNumber?: string;
  yearsExperience?: number;        
  creatorAdminId: number;   
}