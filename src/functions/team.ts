import { ITeam } from "@/interfaces/interface";
import axios from "axios";
import { toast } from "sonner";

// Fetch function to get the list of Teams
export const fetchTeams = async () => {
    console.log("Team fetching start");
    try {
      console.log("getting response");

      // Make a GET request to the '/api/Teams' endpoint
      const response = await fetch('/api/teams', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response is not OK (status is not 200)
      if (!response.ok) {
        throw new Error('Failed to fetch Teams');
      }

      // Parse the response JSON which contains both `Teams` and `count`
      const data = await response.json();
      const { Teams, count } = data;

      console.log("Teams--->", Teams);
      console.log("Count--->", count);

      // Return both Teams and count
      return { Teams, count };
    } catch (error) {
      console.error('Error fetching Teams:', error);

      // Return an empty object with both `Teams` and `count` in case of error
      return { Teams: [], count: 0 };
    }
  };


// Submit function for Team form
export const submitTeamForm = async (data: ITeam) => {
  try {
    console.log("Submitting Team data:", data);

    // Send POST request to create a new Team
    const response = await axios.post('/api/teams', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Log the response for debugging
    toast.success("New Team Created");

    // Return the newly created Team object
    return response.data;
  } catch (error) {
    console.error('Error submitting Team form:', error);
    throw new Error('Failed to submit Team form');
  }
};
