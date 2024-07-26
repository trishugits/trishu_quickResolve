export const GenderOptions = ["Male", "Female", "Other"];

export const PatientFormDefaultValues = {
  name: "",
  email: "",
  phone: "",
  gender: "Male" as Gender,
  admissionNumber: "",
  year: "",
  course: "",
  emergencyContactNumber: "",
  branch: "",
  hostelBlock: "",
  roomNumber: "",
  userId: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const IssueTypes = [
  {
    name: "Carpentry",
  },
  {
    name: "Electrical",
  },
  {
    name: "HouseKeeping",
  },
  {
    name: "Painting",
  },
  {
    name: "Plumbing",
  },
  {
    name: "Internet and Connectivity",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};