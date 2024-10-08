import { ITeam } from "@/interfaces/interface";

export const onAddSubmitTeam = (data: ITeam) => {
    console.log("Team Data:", data);
    // Note: form.reset() has been removed as there's no form instance
  };
