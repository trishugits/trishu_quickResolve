import { IssueTypes } from "@/constants";
import { z } from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  gender: z.enum(["Male", "Female", "Other"]),
  course: z
    .string()
    .min(2, "Course must be at least 2 characters")
    .max(10, "Course must be at most 10 characters"),
  year: z
    .string()
    .min(1, "Year must be at least 1 characters"),
  branch: z
    .string()
    .min(2, "Branch must be at least 2 characters")
    .max(50, "Branch must be at most 50 characters"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number"
    ),
  admissionNumber: z
    .string()
    .min(2, "Admission Number must be at least 2 characters")
    .max(50, "Admission Number must be at most 50 characters"),
  hostelBlock: z
    .string()
    .min(3, "Policy number must be at least 3 characters")
    .max(100, "Policy number must be at most 100 characters"),
  roomNumber: z
    .string()
    .min(3, "Policy number must be at least 3 characters")
    .max(10, "Policy number must be at most 10 characters"),
  identificationDocument: z.custom<File[]>().optional(),
  resolutionConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to resolution in order to proceed",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

export const CreateAppointmentSchema = z.object({
  issueTypes: z.string().min(2, "Select at least one issue"),
  issue: z
    .string()
    .min(2, "Issue must be at least 2 characters")
    .max(500, "Issue must be at most 500 characters"),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  issueTypes: z.string().min(2, "Select at least one issue"),
  issue: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  issueTypes: z.string().min(2, "Select at least one issue"),
  issue: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}