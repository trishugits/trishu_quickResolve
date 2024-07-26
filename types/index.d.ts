/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "Male" | "Female" | "Other";
declare type Status = "pending" | "scheduled" | "cancelled";

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
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
  issueTypes:string;
  issue: string;

}

declare type CreateAppointmentParams = {
  userId: string;
  patient: string;
  issue: string;
  issueTypes: string ;
  status: Status;
  cancellationReason: string
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  appointment: Appointment;
  type: string;
};

declare module 'shimmer';
