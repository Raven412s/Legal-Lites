export const deleteByToolbar = async (ids: string | string[], API:string) => {
    console.log(API)
    const response = await fetch(API, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: Array.isArray(ids) ? ids : [ids] }), // Send as an array, even if it's a single id
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting user(s)");
    }

    return ids; // Return the ids (or array of ids) that were deleted
  };
