import { DistrictName } from "@/lib/constants";

export interface Candidate {
  id?: string;
  _id?: string; // MongoDB ID
  name: string;
  address: string;
  party: string;
  contactNumber: string;
  districtId: string;
}

export interface ArmyCamp {
  id?: string;
  _id?: string; // MongoDB ID
  unit: string;
  location: string;
  manpower: number;
  contactNumber: string;
  districtId: string;
}

export type IncidentCategory = "normal" | "less-critical" | "critical";

export interface Update {
  id?: string;
  _id?: string;
  time: string;
  location: string;
  incident: string;
  category: IncidentCategory;
  requirements?: string;
  action: string;
  districtId: string;
}

export type Role = "superadmin" | DistrictName

export interface User {
  id: string;
  email: string;
  role?: Role;
  name: string;
  password?: string;
}