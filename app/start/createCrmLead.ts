import { z } from "zod";

const ZendeskLead = z.object({
  first_name: z.string().min(1, "Vorname ist erforderlich"),
  last_name: z.string().min(1, "Nachname ist erforderlich"),
  organization_name: z.string().min(1, "Organisation ist erforderlich"),
  source_id: z.number().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url().optional(),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  fax: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  skype: z.string().optional(),
  address: z
    .object({
      line1: z.string().optional(),
      city: z.string().optional(),
      postal_code: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
  custom_fields: z.record(z.string(), z.string().optional()).optional(),
});

export type ZendeskLead = z.infer<typeof ZendeskLead>;

async function sendLeadToZendesk(lead: ZendeskLead): Promise<void> {
  const response = await fetch("https://api.getbase.com/v2/leads", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ZENDESK_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ data: lead }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error sending lead to Zendesk: ${errorData.errors}`);
  }
}

// export the function
export { ZendeskLead, sendLeadToZendesk };
