import { ILeads } from "@/interfaces/interface";
import axios from "axios";
import { toast } from "sonner";

export const submitLeadsForm = async (data: ILeads) => {
    try {
      console.log("Submitting leads data:", data);

      // Send POST request to create a new lawyer
      const response = await axios.post('/api/leads', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Log the response for debugging
      toast.success("New lead Created");

      // Return the newly created lawyer object
      return response.data;
    } catch (error) {
      console.error('Error submitting lead form:', error);
      throw new Error('Failed to submit lead form');
    }
  };

  export const updateLeadsForm = async (LeadId: string, data: ILeads) => {
    try {
      console.log("Updating lead data:", data);

      // Send PUT request to update the lawyer by ID
      const response = await axios.put(`/api/leads/${LeadId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Log the response for debugging
      toast.success("Lead Updated Successfully");

      // Return the updated lawyer object
      return response.data;
    } catch (error) {
      console.error('Error updating Lead form:', error);
      throw new Error('Failed to update Lead form');
    }
  };
