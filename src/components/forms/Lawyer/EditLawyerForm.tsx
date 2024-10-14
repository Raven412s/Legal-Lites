import { getLawyerById, } from "@/actions/getLawyerByID";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateLawyerForm } from "@/functions/lawyer";
import { ILawyer, LawyerFormProps } from "@/interfaces/interface";
import { lawyerSchema } from "@/zod-schemas/zLawyer";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const EditLawyerForm: React.FC<LawyerFormProps> = ({ onClose, lawyerId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const editLawyerForm = useForm<ILawyer>({
    resolver: zodResolver(lawyerSchema),
    defaultValues: {
      title: "Mr.",
      name: "",
      phone: "",
      email: "",
      dob: undefined,
      designation: "Senior Counsel",
      bciRegistrationNo: ""
    }
  });

  // Load the lawyer data when the component mounts
  useEffect(() => {
    if (lawyerId) {
      setIsLoading(true);
      getLawyerById(lawyerId)
        .then((lawyer) => {
          // Set the form values using setValue for each field
          editLawyerForm.setValue("title", lawyer.title);
          editLawyerForm.setValue("name", lawyer.name);
          editLawyerForm.setValue("phone", lawyer.phone);
          editLawyerForm.setValue("email", lawyer.email);
          editLawyerForm.setValue("dob", new Date(lawyer.dob)); // Convert the date if needed
          editLawyerForm.setValue("designation", lawyer.designation);
          editLawyerForm.setValue("bciRegistrationNo", lawyer.bciRegistrationNo);
        })
        .catch((error) => {
          console.error("Failed to fetch lawyer data:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [lawyerId]);

  const onSubmitLawyer = async (data: ILawyer) => {
    setIsLoading(true);
    try {
      const updatedLawyer = await updateLawyerForm(lawyerId, data); // Pass the lawyerId
      console.log("Lawyer Updated:", updatedLawyer);
      router.push("/teams");
      onClose();
      editLawyerForm.reset();
    } catch (error) {
      console.error("Failed to submit lawyer form:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Form {...editLawyerForm}>
      <form onSubmit={editLawyerForm.handleSubmit(onSubmitLawyer)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={editLawyerForm.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title:</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select a title" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="">
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
            control={editLawyerForm.control}
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
            control={editLawyerForm.control}
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
            control={editLawyerForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input {...field} type="email" className="px-2 " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

<FormField
  control={editLawyerForm.control}
  name="dob"
  render={({ field }) => (
    <FormItem>
      <FormLabel>DOB:</FormLabel>
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
            control={editLawyerForm.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation:</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select a designation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="">
                    <SelectItem value="Junior Counsel" className="hover:rounded-md hover:border hover:border-white">Junior Counsel</SelectItem>
                    <SelectItem value="Senior Counsel" className="hover:rounded-md hover:border hover:border-white">Senior Counsel</SelectItem>
                    <SelectItem value="Para-Legal" className="hover:rounded-md hover:border hover:border-white">Para-Legal</SelectItem>
                    <SelectItem value="Office Executive" className="hover:rounded-md hover:border hover:border-white">Office Executive</SelectItem>
                    <SelectItem value="Other" className="hover:rounded-md hover:border hover:border-white">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={editLawyerForm.control}
            name="bciRegistrationNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BCI Registration No.:</FormLabel>
                <FormControl>
                  <Input {...field} className="px-2 " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="mt-4" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update
        </Button>
      </form>
    </Form>
  );
};
