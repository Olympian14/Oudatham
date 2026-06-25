export const DEPARTMENTS = [
  "General Medicine",
  "General Surgery",
  "Orthopaedics",
  "Paediatrics",
  "Obstetrics & Gynaecology",
  "ENT",
  "Ophthalmology",
  "Psychiatry",
  "Dermatology",
  "Respiratory Medicine",
] as const;

export type Department = (typeof DEPARTMENTS)[number];
