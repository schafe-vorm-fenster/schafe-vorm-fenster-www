---
artefact: requirement
id: FUN-WEB-0096
class: FUN
domain: WEB
status: DRAFT
area: forms-and-leads
source: "DEC-0051, DEC-0052"
evidence_sufficiency: S3
---

# FUN-WEB-0096

Newsletter signup shall carry `subscribe-to-newsletter` and shall offer **both** its channels — e-mail and WhatsApp, WhatsApp preferred (DEC-0052 §4 as amended); a surface offering e-mail only does not satisfy the goal. The e-mail route implements double opt-in through envoy (DEC-0051), as a row of the Q-0022 contract; the WhatsApp route is a click-to-chat link with a prefilled subscribe message. Both routes are cookieless and GDPR-compliant, and neither ships before a sending system is in operation.
