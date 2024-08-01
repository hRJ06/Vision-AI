"use server";
import { EmailTemplate } from "@/components/EmailTemplate";
import { Mail } from "@/types";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
export const sendEmail = async ({ name, email, message }: Mail) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "noreply@vision.ai <noreply@vision-ai.in>",
      to: email!,
      subject: "Thank You For Choosing Vision AI",
      react: EmailTemplate({ name, message }),
    });
    if (error) {
      console.error(error);
      throw new Error("Please Try Again");
    }
    return JSON.stringify(data);
  } catch (error) {
    console.error(error);
    throw new Error("Please Try Again");
  }
};
