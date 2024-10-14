import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fetchLawyers, updateLawyerOptions } from "@/functions/lawyer";
import { onAddSubmitTeam } from "@/functions/onAddSubmitTeam";
import { ILawyer, ITeam } from "@/interfaces/interface";
import { teamSchema } from "@/zod-schemas/zTeam";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Select, { GroupBase, MultiValue } from 'react-select';
import { AddLawyerForm } from "./Lawyer/AddLawyerForm";


type OptionType = {
    value: string;
    label: string;
    lawyer: ILawyer;
};

export const AddTeamForm = () => {
    const [lawyerOptions, setLawyerOptions] = useState<GroupBase<OptionType>[]>([]);
    const [selectedLawyers, setSelectedLawyers] = useState<MultiValue<OptionType>>([]);

    const form = useForm<ITeam>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            teamName: '',
            teamMembers: [],
        },
    });

    const { setValue, handleSubmit } = form;

    useEffect(() => {
        const loadLawyers = async () => {
            const lawyers = await fetchLawyers();
            const options = updateLawyerOptions(lawyers?.lawyers);
            setLawyerOptions([options]);
        };
        loadLawyers();
    }, []);

    const handleLawyerChange = (selectedOptions: MultiValue<OptionType>) => {
        const selectedLawyersData = selectedOptions.map((option) => option.lawyer);
        setSelectedLawyers(selectedOptions);
        setValue('teamMembers', selectedLawyersData);
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

                <div className="flex space-x-4">
                    <Button type="submit">Submit</Button>

                    {/* New Button to open dialog for adding lawyer */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost">Register Lawyer</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                            <AddLawyerForm onClose={() => {}} lawyerId="" />
                        </DialogContent>
                    </Dialog>
                </div>
            </form>
        </Form>
    );
};
