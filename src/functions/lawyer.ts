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
    console.log("lawyer fetching start")
    try {
        console.log("getting response")
      const response = await fetch('/api/lawyers', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
          },
      });
      // If the response status is OK (200), return the lawyers data
      if (!response.ok) {
        throw new Error('Failed to fetch lawyers');
      }
      const lawyers = await response.json()
      console.log("Lawyers--->", lawyers)
      return lawyers;
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      return [];  // Return an empty array in case of error
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
