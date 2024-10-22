import axios from 'axios';

export const getLeadById = async (id: string) => {
  try {
    if (!id) {
      throw new Error('Lead ID is required');
    }

    // Fetch lawyer by ID from the API
    const response = await axios.get(`/api/leads/${id}`);

    // Check for success status
    if (response.status !== 200) {
      throw new Error('Failed to fetch the lead');
    }

    // Extract and return the lawyer data
    const lead = response.data.data;
    console.log("lead", lead)
    return lead;
  } catch (error: any) {
    console.error('Error fetching lawyer by ID:', error.message || error);
    throw error;  // Re-throw the error for further handling if needed
  }
};
