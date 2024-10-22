    // Fetch All users function
    export const getAllLeads = async ({
        page,
        pageSize,
        search,
        designation,
      }: {
        page: number;
        pageSize: number;
        search: string;
        designation: string;
      }) => {
        // Build query parameters for pagination, search, and filtering
        const queryParams = new URLSearchParams();

        if (page) queryParams.append("page", String(page));
        if (pageSize) queryParams.append("pageSize", String(pageSize));
        if (search) queryParams.append("search", search);
        if (designation) queryParams.append("designation", designation);

        const response = await fetch(`/api/get-for-table/leads?${queryParams.toString()}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return response.json();
      };
