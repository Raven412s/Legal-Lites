import { z } from "zod";

// Lawyer Zod Schema
const lawyerSchema = z.object({
  title: z.enum(["Adv.", "Mr.", "Mrs.", "Miss.", "Dr."]),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number should have at least 10 digits").max(15, "Phone number should be valid"),
  email: z.string().email("Must be a valid email"),
  dob: z.union([z.string(), z.date()]).transform((val) => {
    // If dob is passed as a string, try to convert it to a Date object
    if (typeof val === "string") {
      const parsedDate = new Date(val);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format. Expected YYYY-MM-DD.");
      }
      return parsedDate;
    }
    return val; // if it's already a Date object, return it as-is
  }),
  designation: z.enum(["Junior Counsel", "Senior Counsel", "Para-Legal", "Office Executive", "Other"]),
  bciRegistrationNo: z.string().optional().or(z.literal("NA")),
  _createdAt: z.union([z.string(), z.date()]).transform((val) => {
    if (typeof val === "string") {
      const parsedDate = new Date(val);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format. Expected YYYY-MM-DD.");
      }
      return parsedDate;
    }
    return val;
  }).default(() => new Date()),
}).refine((data) => {
  if (["Junior Counsel", "Senior Counsel"].includes(data.designation) && (!data.bciRegistrationNo || data.bciRegistrationNo === "NA")) {
    return false;
  }
  return true;
}, {
  message: "BCI Registration No. is required for Junior and Senior Counsel",
  path: ["bciRegistrationNo"],
});

export { lawyerSchema };
