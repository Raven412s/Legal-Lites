import axios from 'axios';

export async function fetchTeams() {
  try {
    const response = await axios.get('/api/teams');
    return response.data; // Assuming the API sends the data in the response body
  } catch (error: any) {
    console.error('Error fetching teams:', error.message);
    throw error;
  }
}
