import { ITeam } from "@/interfaces/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Function to submit the form data to the API
export const onAddSubmitTeam = async (data: ITeam): Promise<ITeam> => {
    console.log("form data", data);
    try {
        console.log("Submitting Team data:", data);

        // Send POST request to create a new lawyer
        const response = await axios.post('/api/teams', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Log the response for debugging
        console.log('Team created:', response.data);

        // Return the newly created lawyer object
        return response.data;
      } catch (error) {
        console.error('Error submitting team form:', error);
        throw new Error('Failed to submit team form');
      }
};

// Hook to handle the mutation with a query key for teams
export const useAddTeamMutation = () => {
  const queryClient = useQueryClient(); // Access queryClient for invalidating cache
  const queryKey = ["teams"]; // Define a specific query key for teams

  return useMutation<ITeam, Error, ITeam>({
    mutationFn: onAddSubmitTeam,
    mutationKey: queryKey, // Add the query key for mutation
    onMutate: async (newTeam: ITeam) => {
      // Cancel ongoing queries related to teams
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousTeams = queryClient.getQueryData<ITeam[]>(queryKey);

      // Optimistically update to the new team list
      if (previousTeams) {
        queryClient.setQueryData<ITeam[]>(queryKey, (oldData) =>
          oldData ? [...oldData, newTeam] : [newTeam]
        );
      }

      // Return context with the previous team snapshot
      return { previousTeams };
    },
    onError: (error: Error, newTeam: ITeam, context: unknown) => {
      console.error("Error adding team:", error.message);

      // If mutation fails, roll back to the previous state
      if (context && typeof context === 'object' && 'previousTeams' in context) {
        queryClient.setQueryData<ITeam[]>(queryKey, (context as { previousTeams: ITeam[] }).previousTeams);
      }
    },
    onSettled: () => {
      // Invalidate teams query to refetch the updated list after mutation
      queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: (data: ITeam) => {
      // Handle success, like showing a notification or redirect
      console.log("Team added successfully:", data);
    },
  });
};
