// menuItems.ts
import { MenuItem } from '@/interfaces/interface';
import { FaCalendar, FaHome, FaTasks, FaUser, FaUsers } from 'react-icons/fa';

const menuItems: MenuItem[] = [
  { label: 'Home', icon: FaHome, link: '/home' },
  {
    label: 'Teams',
    icon: FaUsers,
    children: [
      { label: 'Manage Team', icon: FaTasks, link: '/teams' },
      { label: 'Create Team', icon: FaTasks, link: '/teams/add' },
    ],
  },
  {
    label: 'Lawyers',
    icon: FaUser,
    children: [
      { label: 'Manage Lawyer', icon: FaTasks, link: '/lawyers' },
      { label: 'Create Lawyer', icon: FaTasks, link: '/lawyers/add' },
    ],
  },
  { label: 'Day-Planner', icon: FaCalendar, link: '/day-planner' },
];

export default menuItems;
