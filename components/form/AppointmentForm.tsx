"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { Dispatch, SetStateAction, useState } from "react"
import { getAppointmentSchema, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { RadioGroup } from "../ui/radio-group"
import { IssueTypes, GenderOptions } from "@/constants"
import FileUploader from "../FileUploader"
import { FormFieldType } from "./PatientForm"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"



const AppointmentForm = (
  {
    userId,
    patientId,
    type = "create",
    appointment,
    setOpen,
  }: {
    userId: string;
    patientId: string;
    type: "create" | "schedule" | "cancel";
    appointment?: Appointment;
    setOpen?: Dispatch<SetStateAction<boolean>>;
  }
) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const AppointmentFormValidation = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      issueTypes: appointment ? appointment.issueTypes : '',
      issue: "",
      cancellationReason: appointment ? appointment.cancellationReason : '',
    },
  })
 
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    let status;
    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        status = 'pending';
        break;
    }
    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          issue: values.issue!,
          issueTypes: values.issueTypes,
          status: status as Status,
          cancellationReason: values.cancellationReason!,
        } 

         
        const appointment = await createAppointment(appointmentData);

        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            issueTypes: values.issueTypes,
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type
        }
        console.log('i am here')
        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        if(updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  let buttonLabel;
  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment';
        break;
    case 'create':
      buttonLabel = 'Create Appointment';
        break;
    case 'schedule':
      buttonLabel = 'Schedule Appointment'
  
    default:
        break;
  }

    return (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === 'create' && <section className="mb-12 space-y-4">
          <h1 className="header">New Issue?.. 😲</h1>
          <p className="text-dark-700">Lets resolve it.</p>
        </section>}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="issueTypes"
              label="Issue Category"
              placeholder="Select the type of issue"
            >
              {IssueTypes.map((issue) => (
                <SelectItem key={issue.name} value={issue.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{issue.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="issue"
                label="Solution"
                placeholder="Elaborate your solution for users convenience"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for Cancellation"
            placeholder="Please provide a reason for cancellation"  
          />
        )}
        
        

        <SubmitButton isLoading={isLoading} className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}>{buttonLabel}</SubmitButton>
      </form>
    </Form>
    )
  }
export default AppointmentForm

