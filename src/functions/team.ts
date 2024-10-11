import { ITeam } from "@/interfaces/interface";
import axios from "axios";
import { toast } from "sonner";

// This function maps the Teams into a select-friendly format
// This function maps the Teams into a select-friendly format
export const populateTeamOptions = (Teams: ITeam[]) => {
    return Teams.map((Team) => ({
      value: Team._id, // Use Team._id (or bciRegistrationNo) as reference
      label: `${Team.teamName}`,
      Team, // Store the full Team object here in case needed later
    }));
  };


// Function that updates options, returning them for the component to use
export const updateTeamOptions = (Teams: ITeam[]) => {
  return {
    label: "Teams",
    options: populateTeamOptions(Teams),  // Use the mapped options
  };
};

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
