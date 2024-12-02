"use server";

import { z } from "zod";
import { ZendeskLead, sendLeadToZendesk } from "./createCrmLead";

// Define the zod schema for form validation
const FormSchema = z.object({
  organization: z.string().min(1, "Organisation ist erforderlich"),
  firstname: z.string().min(1, "Vorname ist erforderlich"),
  lastname: z.string().min(1, "Nachname ist erforderlich"),
  phone: z.string().min(1, "Telefonnummer ist erforderlich"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  address: z.string().optional(),
  zip: z.string().optional(),
  city: z.string().optional(),
  website: z.string().optional(),
  calendarId: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export type FormSchema = z.infer<typeof FormSchema>;

export async function createLead(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  console.log("formData", formData);

  // create object from formData
  const dataObject: FormSchema = {
    organization: formData.get("organization") as string,
    firstname: formData.get("firstname") as string,
    lastname: formData.get("lastname") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    address: formData.get("address") as string,
    zip: formData.get("zip") as string,
    city: formData.get("city") as string,
    website: formData.get("website") as string,
    calendarId: formData.get("calendarId") as string,
    source: formData.get("source") as string,
    notes: formData.get("notes") as string,
  };

  const parse = FormSchema.safeParse(dataObject);

  console.log(parse);

  if (!parse.success) {
    // Handle validation errors
    console.error(parse.error.errors);
    return { message: "Validation failed" };
  }

  const data = parse.data;

  const description = `calendarId: ${data.calendarId}\nsource: ${data.source}\nnotes: ${data.notes}`;

  const lead: ZendeskLead = {
    first_name: data.firstname,
    last_name: data.lastname,
    organization_name: data.organization,
    email: data.email,
    phone: data.phone,
    website: data.website,
    address: data.address
      ? {
          line1: data.address,
          city: data.city,
          postal_code: data.zip,
        }
      : undefined,
    description,
  };

  try {
    await sendLeadToZendesk(lead);
    return { message: "SUCCESS" };
  } catch (error) {
    console.error(error);
    return { message: "Oh. Es ist ein Fehler aufgetreten." };
  }
}
