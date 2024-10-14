import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lawyerSchema } from "@/zod-schemas/zLawyer";
import { ILawyer } from "@/interfaces/interface";
import { LawyerFormProps } from "@/interfaces/interface";
import { submitLawyerForm } from "@/functions/lawyer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const AddLawyerForm: React.FC<LawyerFormProps> = ({ onClose }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const addLawyerForm = useForm<ILawyer>({
    resolver: zodResolver(lawyerSchema),
  });

  const onSubmitLawyer = async (data: ILawyer) => {
    setIsLoading(true);
    try {
      // Call the submit function to send the data
      const newLawyer = await submitLawyerForm(data);
      console.log("New Lawyer Created:", newLawyer);
      // Close the modal and reset the form on success
      onClose();
      addLawyerForm.reset();
      router.push("/teams");
    } catch (error) {
      console.error("Failed to submit lawyer form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Watch for changes in the designation field
  const designation = addLawyerForm.watch("designation");

  const isRegistrationDisabled =
    designation === "Para-Legal" || designation === "Office Executive" || designation === "Other";

  return (
    <Form {...addLawyerForm}>
      <form onSubmit={addLawyerForm.handleSubmit(onSubmitLawyer)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={addLawyerForm.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title:</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a title" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Adv.">Adv.</SelectItem>
                    <SelectItem value="Mr.">Mr.</SelectItem>
                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                    <SelectItem value="Miss.">Miss.</SelectItem>
                    <SelectItem value="Dr.">Dr.</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addLawyerForm.control}
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
            control={addLawyerForm.control}
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
            control={addLawyerForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input {...field} type="email" className="px-2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addLawyerForm.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DOB:</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value ? field.value.toISOString().split('T')[0] : ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    className="px-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addLawyerForm.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation:</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a designation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Junior Counsel">Junior Counsel</SelectItem>
                    <SelectItem value="Senior Counsel">Senior Counsel</SelectItem>
                    <SelectItem value="Para-Legal">Para-Legal</SelectItem>
                    <SelectItem value="Office Executive">Office Executive</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addLawyerForm.control}
            name="bciRegistrationNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BCI Registration No.:</FormLabel>
                <FormControl>
                  <Input {...field} className="px-2" disabled={isRegistrationDisabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="mt-4" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};
