import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lawyerSchema,  } from "@/zod-schemas/zLawyer";
import { ILawyer } from "@/interfaces/interface";
import { LawyerFormProps } from "@/interfaces/interface";
import { submitLawyerForm } from "@/functions/lawyer";

export const AddLawyerForm: React.FC<LawyerFormProps> = ({ onClose }) => {
  const form = useForm<ILawyer>({
    resolver: zodResolver(lawyerSchema),
  });

  const onSubmitLawyer = async (data: ILawyer) => {
    try {
      // Call the submit function to send the data
      const newLawyer = await submitLawyerForm(data);
      console.log("New Lawyer Created:", newLawyer);

      // Close the modal and reset the form on success
      onClose();
      form.reset();
    } catch (error) {
      console.error("Failed to submit lawyer form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitLawyer)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title:</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-zinc-800 text-slate-50">
                    <SelectValue placeholder="Select a title" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-800 text-slate-50">
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
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name:</FormLabel>
              <FormControl>
                <Input {...field} className="bg-zinc-800 px-2 text-slate-50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone:</FormLabel>
              <FormControl>
                <Input {...field} className="bg-zinc-800 px-2 text-slate-50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email:</FormLabel>
              <FormControl>
                <Input {...field} type="email" className="bg-zinc-800 px-2 text-slate-50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
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
                  className="bg-zinc-800 px-2 text-slate-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designation:</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-zinc-800 text-slate-50">
                    <SelectValue placeholder="Select a designation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-800 text-slate-50">
                  <SelectItem value="Junior Counsel" className="hover:rounded-md hover:border hover:border-white hover:bg-zinc-800">Junior Counsel</SelectItem>
                  <SelectItem value="Senior Counsel" className="hover:rounded-md hover:border hover:border-white hover:bg-zinc-800">Senior Counsel</SelectItem>
                  <SelectItem value="Para-Legal" className="hover:rounded-md hover:border hover:border-white hover:bg-zinc-800">Para-Legal</SelectItem>
                  <SelectItem value="Office Executive" className="hover:rounded-md hover:border hover:border-white hover:bg-zinc-800">Office Executive</SelectItem>
                  <SelectItem value="Other" className="hover:rounded-md hover:border hover:border-white !hover:bg-zinc-800">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bciRegistrationNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BCI Registration No.:</FormLabel>
              <FormControl>
                <Input {...field} className="bg-zinc-800 px-2 text-slate-50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-zinc-900">Submit</Button>
      </form>
    </Form>
  );
};
