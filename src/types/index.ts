import { DistrictName } from "@/lib/constants";

export interface Candidate {
  id?: string;
  _id?: string;
  name: string;
  address: string;
  party: string;
  contactNumber: string;
  districtId: string;
  upazilaId: string;
}

export interface ArmyCamp {
  id?: string;
  _id?: string;
  unit: string;
  location: string;
  map: string;
  manpower: number;
  contactNumber: string;
  districtId: string;
  upazilaId: string;
}

export type IncidentCategory = "normal" | "less-critical" | "critical";

export interface Update {
  id?: string;
  _id?: string;
  location: string;
  incident: string;
  category: IncidentCategory;
  requirements?: string;
  action: string;
  districtId: string;
  upazilaId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PollingInfo {
  id?: string;
  _id?: string;
  serial: string;
  name: string;
  constituency: string;
  phoneNumber: string;
  location: string;
  districtId: string;
  upazilaId: string;
}

export type Role = "superadmin" | DistrictName

export interface User {
  id: string;
  email: string;
  role?: Role;
  name: string;
  password?: string;
}