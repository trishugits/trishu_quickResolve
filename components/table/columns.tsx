"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"


import { MoreHorizontal } from "lucide-react"
import { StatusBadge } from "../StatusBadge"
import { IssueTypes } from "@/constants"
import { AppointmentModal } from "../AppointmentModal"
import { Appointment } from "@/types/appwrite.types"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Appointment>[] = [
    {
        header: "ID",
        cell: ({ row }) => {
          return <p className="text-14-medium ">{row.index + 1}</p>;
        },
    },
    {
        accessorKey: "patient",
        header: "Patient",
        cell: ({ row }) => {
          return <p className="text-14-medium ">{row.original.patient.name}</p>;
        },
      },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div className="min-w-[115px]">
            <StatusBadge status={appointment.status} />
          </div>
        );
      },
  },
  {
    accessorKey: "issueTypes",
    header: "Issue Category",
    cell: ({ row }) => {
      const appointment = row.original;

      const issue = IssueTypes.find(
        (iss) => iss.name === appointment.issueTypes
      );

      return (
        <div className="flex items-center gap-3">
          <p className="whitespace-nowrap">{issue?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-1">
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      );
    },
  },
]
