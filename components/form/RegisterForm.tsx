"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import FileUploader from "../FileUploader"



const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
      
    },
  })
 
  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    // Store file info in form data as
    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        admissionNumber: values.admissionNumber,
        course: values.course,
        branch: values.branch,
        emergencyContactNumber: values.emergencyContactNumber,
        year: values.year,
        roomNumber: values.roomNumber,
        hostelBlock: values.hostelBlock,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
        resolutionConsent: values.resolutionConsent,
        disclosureConsent: values.disclosureConsent,
        issueTypes: '',
        issue: '',

      };

      const newPatient = await registerPatient(patient);
      console.log(patient);
      if (newPatient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

    return (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome👋</h1>
          
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Personal Details</h2>
            </div>
        </section>
        
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@example.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone Number"
          placeholder="(+91) 123 456 7890"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="course"
          label="Course"
          placeholder="B.Tech/M.Tech/MCA/MBA"
          iconAlt="course"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="branch"
          label="Branch (In case of B.Tech)"
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="year"
          label="Year"
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="gender"
          label="Gender"
          renderSkeleton={(field) => (
            <FormControl>
                <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onValueChange} defaultValue={field.values}>
                    {GenderOptions.map((option) => (
                        <div key={option} className="radio-group">
                            <RadioGroupItem value={option} id={option}/>
                            <label htmlFor={option} className="cursor-pointer">
                                {option}
                            </label>

                            
                        </div>
                    ))}
                </RadioGroup>
            </FormControl>
          )}
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">  
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="emergencyContactNumber"
          label="Emergency Contact Number"
          placeholder="(+91) 123 456 7890"
          iconSrc="/assets/icons/user.svg"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="admissionNumber"
          label="Admission Number"
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="hostelBlock"
          label="Hostel Block"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="roomNumber"
          label="Room Number"
        />
        </div>
        
        
        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned copy of Hostel ID Card"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange}/>
            </FormControl>
          )}
        />

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Consent and Privacy</h2>
            </div>
        </section>
        
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="resolutionConsent"
          label="I submit this complaint voluntarily and understand more details may be needed."
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to the use and disclosure of information provided."
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="The information provided in this form is accurate to the best of my knowledge."
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
    )
}

export default RegisterForm

