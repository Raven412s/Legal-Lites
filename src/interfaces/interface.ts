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


export interface LawyerFormProps {
  onClose: () => void;
  lawyerId: string
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
