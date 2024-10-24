import { IconType } from "react-icons";

export interface ITeam {
  teamName: string;
  teamMembers: ILawyer[];  // Array of lawyer references
  createdAt: Date;
}

export interface ILawyer {
    _id: string;  // Add this line to allow the lawyer object to optionally include `_id`
    title: "Adv." | "Mr." | "Mrs." | "Miss." | "Dr.";
    name: string;
    phone: string;
    email: string;
    dob: Date;
    designation: "Junior Counsel" | "Senior Counsel" | "Para-Legal" | "Office Executive" | "Other";
    bciRegistrationNo: string;
    verified: boolean;  // This will be used for OTP verification in future
  }

  export type TFollowUpRecord =    {
        comment: string,
        nextFollowUp: Date
    }


  export interface ILeads {
    _id: string;  // Add this line to allow the leads object to optionally include `_id`
    name: string;
    strong: boolean;  // This will be used for OTP verification in future
    phone: string;
    court: string;
    nextFollowUp: Date;
    caseType: "Civil" | "Matrimonial" | "Criminal" | "Divorce" | "Corporate" | "Employment" | "Adoption";
    leadSource: "Walk-in" | "Phone" | "Social Media" | "Referral" | "Local Marketing" | "Other";
    comment: string;  // Added field for comment
    status: "Fresh" | "Open" | "File Received" | "Not Interested" | "Pending" | "Active" // Added field for status
    followUpRecord: TFollowUpRecord[]
  }


export interface LawyerFormProps {
  onClose: () => void;
  lawyerId: string
}

export interface LeadsFormProps {
  onClose: () => void;
  leadsId: string
}

export interface MenuItem {
    label: string;
    icon: IconType;
    link?: string;
    children?: MenuItem[];
  }


export interface SidebarProps {
    isMinimized: boolean;
    onToggle: () => void;
  }
