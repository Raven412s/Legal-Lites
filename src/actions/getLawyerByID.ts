import axios from 'axios';

export const getLawyerById = async (id: string) => {
  try {
    if (!id) {
      throw new Error('Lawyer ID is required');
    }

    // Fetch lawyer by ID from the API
    const response = await axios.get(`/api/lawyers/${id}`);

    // Check for success status
    if (response.status !== 200) {
      throw new Error('Failed to fetch the lawyer');
    }

    // Extract and return the lawyer data
    const lawyer = response.data.data;
    console.log("lawyer", lawyer)
    return lawyer;
  } catch (error: any) {
    console.error('Error fetching lawyer by ID:', error.message || error);
    throw error;  // Re-throw the error for further handling if needed
  }
};
