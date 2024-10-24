import { getLeadById } from "@/actions/getLeadByID";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateLeadsForm } from "@/functions/leads";
import { ILeads, LeadsFormProps } from "@/interfaces/interface";
import { Leads } from "@/models/leads.model";
import { leadsSchema } from "@/zod-schemas/zLead";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const EditLeadForm: React.FC<LeadsFormProps> = ({ onClose, leadsId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const editLeadForm = useForm<ILeads>({
    resolver: zodResolver(leadsSchema),
  });

  // Load the lead data when the component mounts
  useEffect(() => {
    if (leadsId) {
      setIsLoading(true);
      getLeadById(leadsId)
        .then((lead:ILeads) => {
          // Set the form values using setValue for each field
          editLeadForm.setValue("name", lead.name);
          editLeadForm.setValue("phone", lead.phone);
          editLeadForm.setValue("court", lead.court);
          editLeadForm.setValue("nextFollowUp", new Date(lead.nextFollowUp)); // Convert the date if needed
          editLeadForm.setValue("caseType", lead.caseType);
          editLeadForm.setValue("leadSource", lead.leadSource);
          editLeadForm.setValue("comment", lead.comment);
          editLeadForm.setValue("strong", lead.strong);
          editLeadForm.setValue("followUpRecord", lead.followUpRecord);
          console.log(lead.strong)
        })
        .catch((error:any) => {
          console.error("Failed to fetch lead data:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [leadsId]);



  const onSubmitLead = async (data: ILeads) => {
    setIsLoading(true);
    try {
      // Create an object with keys comment and nextFollowUp
      const followUpRecord = {
        comment: data.comment,
        nextFollowUp: data.nextFollowUp,
      };
      // Push the object to the data.followUpRecord
      data.followUpRecord.push(followUpRecord);
      // Use the formatted data to call the update function
      const updatedLead = await updateLeadsForm(leadsId, data); // Pass the leadId
      console.log("Lead Updated:", updatedLead);
      router.push("/leads");
      onClose();
      editLeadForm.reset();
    } catch (error) {
      console.error("Failed to submit lead form:", error);
    } finally {
        queryClient.invalidateQueries({ queryKey: ["leads"] })
      setIsLoading(false);
    }
  };

  return (
    <Form {...editLeadForm}>
      <form onSubmit={editLeadForm.handleSubmit(onSubmitLead)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={editLeadForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name:</FormLabel>
                <FormControl>
                  <Input {...field} className="px-2 " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={editLeadForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone:</FormLabel>
                <FormControl>
                  <Input {...field} className="px-2 " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={editLeadForm.control}
            name="court"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Court:</FormLabel>
                <FormControl>
                  <Input {...field} className="px-2 " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={editLeadForm.control}
            name="nextFollowUp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Follow-Up Date:</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value && !isNaN(new Date(field.value).getTime())
                      ? new Date(field.value).toISOString().split('T')[0]
                      : ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    className="px-2 "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={editLeadForm.control}
            name="caseType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Type:</FormLabel>
                <FormControl>
                  <Input {...field} className="px-2 " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={editLeadForm.control}
            name="leadSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lead Source:</FormLabel>
                <FormControl>
                  <Input {...field} className="px-2 " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={editLeadForm.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment:</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} className="px-2 " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

<FormField
  control={editLeadForm.control}
  name="strong"
  render={({ field }) => (
    <FormItem className="flex items-center">
      <FormControl>
      <Checkbox
  className="size-4 mx-3"
  checked={field.value ?? false} // Fallback to false if field.value is undefined
  onCheckedChange={field.onChange}
/>

      </FormControl>
      <FormLabel className="ml-2">Strong Lead</FormLabel>
      <FormMessage />
    </FormItem>
  )}
/>

        </div>

        <Button
  type="submit"
  className="mt-4"
  disabled={isLoading}
  aria-busy={isLoading}
>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Update
</Button>

      </form>
    </Form>
  );
};
