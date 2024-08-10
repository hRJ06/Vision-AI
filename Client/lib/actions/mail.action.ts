"use server";
import { ContactMail, OTPEmail } from "@/types";
import { RESEND_SENDER, RESEND_CONTACT_SUBJECT, RESEND_OTP_SUBJECT} from "../utils";
import { resend } from "../resend";
import { ContactTemplate } from "@/components/template/ContactTemplate";
import OTPTemplate from "@/components/template/OTPTemplate";

export const sendContactEmail = async ({ name, email, message }: ContactMail) => {
  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_SENDER,
      to: email!,
      subject: RESEND_CONTACT_SUBJECT,
      react: ContactTemplate({ name, message }),
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

export const sendOTPEmail = async ({ name, email, token }: OTPEmail) => {
  try{
    const { data, error } = await resend.emails.send({
      from: RESEND_SENDER,
      to: email!,
      subject: RESEND_OTP_SUBJECT,
      react: OTPTemplate({ name, token }),
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
