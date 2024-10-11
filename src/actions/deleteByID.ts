    // Delete user by ID function
    export const deleteByID = async (id: string,route:string) => {
        const response = await fetch(`/api/${route}/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error deleting user");
        }
        return id;
      }

