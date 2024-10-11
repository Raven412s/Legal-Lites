import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { onAddSubmitTeam } from "@/functions/onAddSubmitTeam";
import { ILawyer, ITeam } from "@/interfaces/interface";
import { teamSchema } from "@/zod-schemas/zTeam";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import Select, { GroupBase, MultiValue } from 'react-select';
import { AddLawyerForm } from "../forms/LawyerForm";
import { fetchLawyers, updateLawyerOptions } from "@/functions/lawyer";

type OptionType = {
    value: string;
    label: string;
    lawyer: ILawyer; // Added full lawyer object here
};

export const AddTeamForm = () => {
    const [lawyerOptions, setLawyerOptions] = useState<GroupBase<OptionType>[]>([]);
    const [selectedLawyers, setSelectedLawyers] = useState<MultiValue<OptionType>>([]);

    const form = useForm<ITeam>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            teamName: '',
            teamMembers: [], // Array of lawyer references or objects
        },
    });

    const { register, setValue, watch, handleSubmit } = form;

    useEffect(() => {
        // Fetch lawyers and update options when the component mounts
        const loadLawyers = async () => {
            const lawyers = await fetchLawyers();
            const options = updateLawyerOptions(lawyers?.lawyers);
            setLawyerOptions([options]);
        };
        loadLawyers();
    }, []);

    const handleLawyerChange = (selectedOptions: MultiValue<OptionType>) => {
        const selectedLawyersData = selectedOptions.map((option) => option.lawyer);  // Store the full lawyer object
        setSelectedLawyers(selectedOptions);  // For displaying selected options
        setValue('teamMembers', selectedLawyersData);  // Update form field with lawyer references
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onAddSubmitTeam)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Team Name:</FormLabel>
                            <FormControl>
                                <Input {...field} className="px-2 text-slate-50" placeholder="Enter team name..." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel>Team Members:</FormLabel>
                    {/* <div className="mb-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button type="button" className="bg-zinc-900">Register Lawyer</Button>
                            </DialogTrigger>
                            <DialogContent className="card w-[90%] bg-muted-foreground border-primary-foreground border-dashed border-2 backdrop-blur-sm" style={{ boxShadow: 'rgba(128, 128, 128, 0.84) 0px 3px 8px' }}>
                                <AddLawyerForm onClose={() => {}} />
                            </DialogContent>
                        </Dialog>
                    </div> */}

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
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                backgroundColor: 'rgb(39, 39, 42)',
                                color: '#f8fafc',
                                padding: '0 0.5rem',
                            }),
                            input: (provided) => ({
                                ...provided,
                                color: '#f8fafc',
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isFocused ? 'rgb(39, 39, 42 )' : 'rgb(39, 39, 42 )',
                                color: '#f8fafc',
                            }),
                            menu: (provided) => ({
                                ...provided,
                                backgroundColor: 'rgb(39, 39, 42)',
                            }),
                        }}
                        formatOptionLabel={(option: OptionType) => (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedLawyers.some((selected) => selected.value === option.value)}
                                    className="mr-2 size-4"
                                />
                                {option.label}
                            </div>
                        )}
                    />
                </FormItem>

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
};
