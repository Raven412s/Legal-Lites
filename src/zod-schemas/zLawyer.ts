import { z } from "zod";

// Lawyer Zod Schema
const lawyerSchema = z.object({
  title: z.enum(["Adv.", "Mr.", "Mrs.", "Miss.", "Dr."]),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10).max(15, "Phone number should be valid"),
  email: z.string().email("Must be a valid email"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid Date",
  }),
  designation: z.enum(["Junior Counsel", "Senior Counsel", "Para-Legal", "Office Executive", "Other"]),
  bciRegistrationNo: z.string().optional().or(z.literal("NA")),
}).refine((data) => {
  if (["Junior Counsel", "Senior Counsel"].includes(data.designation) && !data.bciRegistrationNo) {
    return false;
  }
  return true;
}, {
  message: "BCI Registration No. is required for Junior and Senior Counsel",
  path: ["bciRegistrationNo"],
});

export {lawyerSchema}
