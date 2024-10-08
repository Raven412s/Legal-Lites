import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ITeam } from "@/interfaces/interface";
import { teamSchema } from "@/zod-schemas/zTeam";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddLawyerForm } from "../forms/LawyerForm";

// Main Team Form
const AddTeamForm: React.FC = () => {
  const form = useForm<ITeam>({
    resolver: zodResolver(teamSchema),
  });

  const onSubmitTeam = (data: ITeam) => {
    console.log("Team Data:", data);
    form.reset(); // Clear the form after submission
  };

  return (
    <div className="max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitTeam)} className="space-y-4">
          <FormField
            control={form.control}
            name="teamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Team Members:</FormLabel>
            {/* Placeholder for Multi-Select Component */}
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button">Register Lawyer</Button>
              </DialogTrigger>
              <DialogContent>
                <AddLawyerForm onClose={() => {}} />
              </DialogContent>
            </Dialog>
          </FormItem>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTeamForm;
