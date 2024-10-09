import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // Shadcn Checkbox import
import { ITeam } from "@/interfaces/interface";
import { teamSchema } from "@/zod-schemas/zTeam";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddLawyerForm } from "../forms/LawyerForm";
import Select, { MultiValue, GroupBase } from 'react-select'; // Import types from react-select
import { useState } from 'react';
import { onAddSubmitTeam } from "@/functions/onAddSubmitTeam";

// Define Option Type for Lawyer Options
type OptionType = {
  value: string;
  label: string;
};

// Lawyer options with groups
const lawyerOptions: GroupBase<OptionType>[] = [
  {
    label: "Frontend",
    options: [
      { value: '0', label: 'Angular' },
      { value: '1', label: 'Bootstrap' },
      { value: '2', label: 'React.js' },
      { value: '3', label: 'Vue.js' },
    ],
  },
  {
    label: "Backend",
    options: [
      { value: '4', label: 'Django' },
      { value: '5', label: 'Laravel' },
      { value: '6', label: 'Node.js' },
    ],
  },
];

export const AddTeamForm = () => {
  // Ensure selectedLawyers is correctly typed
  const [selectedLawyers, setSelectedLawyers] = useState<MultiValue<OptionType>>([]);

  const form = useForm<ITeam>({
    resolver: zodResolver(teamSchema),
  });

  // Handle lawyer selection change with type
  const handleLawyerChange = (selectedOptions: MultiValue<OptionType>) => {
    setSelectedLawyers(selectedOptions);
  };

  // Toggle lawyer selection on checkbox click
  const handleCheckboxToggle = (option: OptionType) => {
    if (selectedLawyers.some(lawyer => lawyer.value === option.value)) {
      // Remove the lawyer if already selected
      setSelectedLawyers(prev => prev.filter(lawyer => lawyer.value !== option.value));
    } else {
      // Add the lawyer if not selected
      setSelectedLawyers(prev => [...prev, option]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onAddSubmitTeam)} className="space-y-4">
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

          {/* Register Lawyer Button at the top */}
          <div className="mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button">Register Lawyer</Button>
              </DialogTrigger>
              <DialogContent>
                <AddLawyerForm onClose={() => {}} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Multi-Select for Lawyers with grouped options and Shadcn UI Checkbox */}
          <Select
            isMulti
            options={lawyerOptions}
            value={selectedLawyers}
            onChange={handleLawyerChange}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select lawyers..."
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            formatOptionLabel={(option: OptionType) => (
              <div className="flex items-center">
                <input
                type="checkbox"
                  checked={selectedLawyers.some((selected) => selected.value === option.value)}
                  onChange={() => handleCheckboxToggle(option)} // Toggle on checkbox click
                  className="mr-2 size-4"
                />
                {option.label} {/* Return the label string */}
              </div>
            )}
          />
        </FormItem>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
