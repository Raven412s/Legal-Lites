import { ILawyer } from "@/interfaces/interface";
import axios from "axios";
import { toast } from "sonner";

// This function maps the lawyers into a select-friendly format
// This function maps the lawyers into a select-friendly format
export const populateLawyerOptions = (lawyers: ILawyer[]) => {
    return lawyers.map((lawyer) => ({
      value: lawyer._id, // Use lawyer._id (or bciRegistrationNo) as reference
      label: `${lawyer.name} (${lawyer.bciRegistrationNo})`,
      lawyer, // Store the full lawyer object here in case needed later
    }));
  };


// Function that updates options, returning them for the component to use
export const updateLawyerOptions = (lawyers: ILawyer[]) => {
  return {
    label: "Lawyers",
    options: populateLawyerOptions(lawyers),  // Use the mapped options
  };
};

// Fetch function to get the list of lawyers
export const fetchLawyers = async () => {
    console.log("lawyer fetching start");
    try {
      console.log("getting response");

      // Make a GET request to the '/api/lawyers' endpoint
      const response = await fetch('/api/lawyers', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response is not OK (status is not 200)
      if (!response.ok) {
        throw new Error('Failed to fetch lawyers');
      }

      // Parse the response JSON which contains both `lawyers` and `count`
      const data = await response.json();
      const { lawyers, count } = data;

      console.log("Lawyers--->", lawyers);
      console.log("Count--->", count);

      // Return both lawyers and count
      return { lawyers, count };
    } catch (error) {
      console.error('Error fetching lawyers:', error);

      // Return an empty object with both `lawyers` and `count` in case of error
      return { lawyers: [], count: 0 };
    }
  };


// Submit function for Lawyer form
export const submitLawyerForm = async (data: ILawyer) => {
  try {
    console.log("Submitting lawyer data:", data);

    // Send POST request to create a new lawyer
    const response = await axios.post('/api/lawyers', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Log the response for debugging
    toast.success("New Lawyer Created");

    // Return the newly created lawyer object
    return response.data;
  } catch (error) {
    console.error('Error submitting lawyer form:', error);
    throw new Error('Failed to submit lawyer form');
  }
};
export const updateLawyerForm = async (lawyerId: string, data: ILawyer) => {
  try {
    console.log("Updating lawyer data:", data);

    // Send PUT request to update the lawyer by ID
    const response = await axios.put(`/api/lawyers/${lawyerId}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Log the response for debugging
    toast.success("Lawyer Updated Successfully");

    // Return the updated lawyer object
    return response.data;
  } catch (error) {
    console.error('Error updating lawyer form:', error);
    throw new Error('Failed to update lawyer form');
  }
};
