import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { Button } from "@/components/ui/button";
import * as Sentry from '@sentry/nextjs'
import { getUser } from "@/lib/actions/patient.actions";

const Success = async({ params: { userId }, searchParams}: SearchParamProps) => {
    const appointmentId = (searchParams?.appointmentId as string) || '';
    const appointment = await getAppointment(appointmentId);
    const user = await getUser(userId);

    Sentry.metrics.set("user_view_appointment-success", user.name);
    
    return (
        <div className="flex max-h-screen h-screen px-[5%]">
            <div className="success-img">
                <Link href='/'>
                    <Image 
                        src="/assets/icons/logo-full.svg"
                        height={1000}
                        width={1000}
                        alt="logo"
                        className="h-10 w-fit"
                    />
                </Link>
                <section className="flex flex-col items-center">
                    <Image
                        src="/assets/gifs/success.gif"
                        height={300}
                        width={280}
                        alt="success"
                    />
                    <h2 className="header mb-6 max-w-[600px] text-center">
                        Your <span className="text-green-500"> issue </span> has been successfully succesfully submitted! 
                    </h2>
                    <p> We will be in touch shortly to resolve your issue</p>

                </section>

                <Button variant="outline" className="shad-primary-btn" asChild>
                    <Link href={`/patients/${userId}/new-appointment`}>
                        New Appointment
                    </Link>

                </Button>
                <p className="copyright">© 2024 QuickResolve</p>
                
            </div>
        </div>
    )
}

export default Success