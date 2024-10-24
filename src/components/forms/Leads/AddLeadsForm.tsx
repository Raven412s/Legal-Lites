import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitLeadsForm } from "@/functions/leads";
import { ILeads, LeadsFormProps } from "@/interfaces/interface";
import { leadsSchema } from "@/zod-schemas/zLead";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const AddLeadsForm: React.FC<LeadsFormProps> = ({ onClose }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const addLeadsForm = useForm<ILeads>({
    resolver: zodResolver(leadsSchema),
  });

  const onSubmitLeads = async (data: ILeads) => {

    setIsLoading(true);
      // Convert comment string to an array if it's not already
  const formattedData = {
    ...data,
    followUpRecord: [{
        comment: data.comment,
        nextFollowUp: data.nextFollowUp
    } ]// Wrap the comment string into an array
  };

    try {
      // Call the submit function to send the data
      const newLead = await submitLeadsForm(formattedData);
      console.log("New Lead Created:", newLead);
      // Close the modal and reset the form on success
      onClose();
      addLeadsForm.reset();
      router.push("/leads");
    } catch (error) {
      console.error("Failed to submit lead form:", error);
    } finally {
        queryClient.invalidateQueries({ queryKey: ["leads"] })
      setIsLoading(false);
    }
  };

  // Watch for changes in the designation field
  const strong = addLeadsForm.watch("strong");

  return (
    <Form {...addLeadsForm}>
      <form onSubmit={addLeadsForm.handleSubmit(onSubmitLeads)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={addLeadsForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name:</FormLabel>
                <FormControl>
                  <Input {...field} className="px-2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addLeadsForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone:</FormLabel>
                <FormControl>
                  <Input {...field} className="px-2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addLeadsForm.control}
            name="court"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Court:</FormLabel>
                <FormControl>
                  <Input {...field} type="text" className="px-2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addLeadsForm.control}
            name="nextFollowUp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Follow Up Date::</FormLabel>
                <FormControl>
                <Input
                     type="date"
                     {...field}
                     value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                     onChange={(e) => field.onChange(new Date(e.target.value))}
                     className="px-2"
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addLeadsForm.control}
            name="caseType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Type:</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select case type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                      <SelectItem value="Civil">Civil</SelectItem>
                      <SelectItem value="Matrimonial">Matrimonial</SelectItem>
                      <SelectItem value="Criminal">Criminal</SelectItem>
                      <SelectItem value="Divorce">Divorce</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                      <SelectItem value="Employment">Employment</SelectItem>
                      <SelectItem value="Adoption">Adoption</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addLeadsForm.control}
            name="leadSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lead Source:</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lead source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Local Marketing">Local Marketing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addLeadsForm.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment:</FormLabel>
                <FormControl>
                  <Textarea {...field}  rows={3} className="px-2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


              <FormField
            control={addLeadsForm.control}
            name="strong"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strong Lead:</FormLabel>
                <FormControl>
                <Checkbox
                    className="size-4 mx-3"
                    checked={Boolean(field.value)} // Explicit conversion to Boolean
                    onCheckedChange={field.onChange}
                />

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="mt-4" disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Submitting...
    </>
  ) : (
    "Submit"
  )}
</Button>


      </form>
    </Form>
  );
};
