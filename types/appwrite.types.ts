import { Models } from "node-appwrite";

export interface Patient extends Models.Document {
  userId: string;
  gender: Gender;
  course: string;
  branch: string;
  admissionNumber: string;
  emergencyContactNumber: string;
  hostelBlock: string;
  year: string;
  roomNumber: string;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
  resolutionConsent: boolean;
  disclosureConsent: boolean;
}

export interface Appointment extends Models.Document {
  patient: Patient;
  status: Status;
  issue: string;
  issueTypes: string;
  userId: string;
  cancellationReason: string;
  

}

