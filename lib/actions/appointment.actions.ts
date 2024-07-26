'use server'
import { ID, Query } from "node-appwrite";
import { DATABASE_ID, databases, APPOINTMENT_COLLECTION_ID, messaging } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
    appointment: CreateAppointmentParams
  ) => {
    try {
      const newAppointment = await databases.createDocument(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        ID.unique(),
        appointment
      );
      revalidatePath("/admin");

      return parseStringify(newAppointment);
    } catch (error) {
      console.error("An error occurred while creating a new appointment:", error);
    }
  };

  export const getAppointment = async(appointmentId: string) => {
    try {
      const appointment = await databases.getDocument(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        appointmentId,
      )

      return parseStringify(appointment);
    } catch (error) {
        console.error(error);
    }
  }
  
  export const getRecentAppointmentList = async () => {
    try {
      const appointments = await databases.listDocuments(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        [Query.orderDesc("$createdAt")]
      );
  
      // const scheduledAppointments = (
      //   appointments.documents as Appointment[]
      // ).filter((appointment) => appointment.status === "scheduled");
  
      // const pendingAppointments = (
      //   appointments.documents as Appointment[]
      // ).filter((appointment) => appointment.status === "pending");
  
      // const cancelledAppointments = (
      //   appointments.documents as Appointment[]
      // ).filter((appointment) => appointment.status === "cancelled");
  
      // const data = {
      //   totalCount: appointments.total,
      //   scheduledCount: scheduledAppointments.length,
      //   pendingCount: pendingAppointments.length,
      //   cancelledCount: cancelledAppointments.length,
      //   documents: appointments.documents,
      // };
  
      const initialCounts = {
        scheduledCount: 0,
        pendingCount: 0,
        cancelledCount: 0,
      };
  
      const counts = (appointments.documents as Appointment[]).reduce(
        (acc, appointment) => {
          switch (appointment.status) {
            case "scheduled":
              acc.scheduledCount++;
              break;
            case "pending":
              acc.pendingCount++;
              break;
            case "cancelled":
              acc.cancelledCount++;
              break;
          }
          return acc;
        },
        initialCounts
      );
  
      const data = {
        totalCount: appointments.total,
        ...counts,
        documents: appointments.documents,
      };
  
      return parseStringify(data);
    } catch (error) {
      console.error(
        "An error occurred while retrieving the recent appointments:",
        error
      );
    }
  };

  export const updateAppointment = async({ appointmentId, userId, appointment, type }:
    
    UpdateAppointmentParams) => {
      try {
        const updatedAppointment = await databases.updateDocument(
          DATABASE_ID!,
          APPOINTMENT_COLLECTION_ID!,
          appointmentId,
          appointment
        )
        if (!updatedAppointment){
          throw new Error('Appointment not found')
        }

        const smsMessage = `Greetings from QuickResolve. ${type === "schedule" ? `Your appointment is confirmed for resolving your issue regarding ${appointment.issueTypes}` : `We regret to inform that your appointment for resolving your issue regarding ${appointment.issueTypes} is cancelled. Reason:  ${appointment.cancellationReason}`}.`;
        await sendSMSNotification(userId, smsMessage);

        // SMS notification
        revalidatePath('/admin');
        return parseStringify(updateAppointment);
        

      } catch (error) {
        console.log(error)
      }
    }

    export const sendSMSNotification = async (userId: string, content: string) => {
      try {
        // https://appwrite.io/docs/references/1.5.x/server-nodejs/messaging#createSms
        const message = await messaging.createSms(
          ID.unique(),
          content,
          [],
          [userId]
        );
        return parseStringify(message);
      } catch (error) {
        console.error("An error occurred while sending sms:", error);
      }
    };