import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { addFollowUpForm, updateLeadsForm } from "@/functions/leads";
import { ILeads, TFollowUpRecord } from "@/interfaces/interface";
import { getLeadById } from "@/actions/getLeadByID";
import { followUpRecordSchema, leadsSchema } from "@/zod-schemas/zLead";
import { useRouter } from "next/navigation";
import { comment } from "postcss";
import { useQueryClient } from "@tanstack/react-query";

export const UpdateCommentFollowUpForm: React.FC<{ leadsId: string; onClose: () => void }> = ({ leadsId, onClose }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [lead,setLead]= useState<ILeads>()
  const queryClient = useQueryClient();
  const form = useForm<TFollowUpRecord>({
    resolver: zodResolver(followUpRecordSchema), // Reuse the schema if it validates the required fields
  });

  // Load the lead's current data when the component mounts
  useEffect(() => {
    if (leadsId) {
      setIsLoading(true);
      getLeadById(leadsId)
        .then((lead: ILeads) => {
            setLead(lead)
          // Set the form values for comment and nextFollowUp
          form.setValue("comment", lead.comment || "");
          form.setValue("nextFollowUp", new Date(lead.nextFollowUp || ""));
        })
        .catch((error: any) => {
          console.error("Failed to fetch lead data:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [leadsId]);

  const onSubmit = async (data: { comment: string; nextFollowUp: Date | string }) => {
    setIsLoading(true);
    console.log("start 1");
    try {
        // Construct only the relevant fields to update
        const updateData = {
            comment: data.comment,
            nextFollowUp: new Date(data.nextFollowUp)
        };

        // Create a new follow-up record by spreading the existing records
        const followUpRecord = [...(lead?.followUpRecord || []), updateData];
        console.log("start 2");
        console.log("followUpRecord", followUpRecord);

        // Update the lead using the correct payload
        const updatedLead = await addFollowUpForm(leadsId, {
            nextFollowUp: updateData.nextFollowUp,
            comment: updateData.comment,
            followUpRecord: followUpRecord
        });

        console.log("add follow up form function passed");
        console.log("Lead Updated:", updatedLead);
        router.push("/leads");
        onClose();
        form.reset();
    } catch (error) {
        console.error("Failed to update lead:", error);
    } finally {
        queryClient.invalidateQueries({ queryKey: ["leads"] })
        setIsLoading(false);
    }
};


console.log(form.formState.errors)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Comment Field */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment:</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} className="px-2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Next Follow-Up Field */}
          <FormField
            control={form.control}
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
                    className="px-2"
                  />
                </FormControl>
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

export default UpdateCommentFollowUpForm;
