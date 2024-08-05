"use server";
import { EmailTemplate } from "@/components/EmailTemplate";
import { Mail } from "@/types";
import { RESEND_SENDER, RESEND_SUBJECT } from "../utils";
import { resend } from "../resend";

export const sendEmail = async ({ name, email, message }: Mail) => {
  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_SENDER,
      to: email!,
      subject: RESEND_SUBJECT,
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
