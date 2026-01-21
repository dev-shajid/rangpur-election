import { DistrictName } from "@/lib/constants";

export interface Candidate {
  id?: string;
  _id?: string;
  name: string;
  address: string;
  constituency: string;
  party: string;
  contactNumber: string;
  districtId: string;
  upazilaId: string;
  driveFileId: string;
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

export type PollingCenterCategory = "dangerous" | "less-dangerous" | "normal";

export interface PollingInfo {
  id?: string;
  _id?: string;
  serial: string;
  name: string;
  union: string;
  location: string;
  map: string;
  maleVoters: number;
  femaleVoters: number;
  minority: number;
  presidingOfficer: string;
  contactDetails: string;
  category: PollingCenterCategory;
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

export interface MainMap {
  id?: string;
  _id?: string;
  mapUrl: string;
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DistrictMap {
  id?: string;
  _id?: string;
  districtId: string;
  mapUrl: string;
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpazilaMap {
  id?: string;
  _id?: string;
  districtId: string;
  upazilaId: string;
  mapUrl: string;
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}