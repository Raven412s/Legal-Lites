// menuItems.ts
import { MenuItem } from '@/interfaces/interface';
import { FaCalendar, FaHome, FaTasks, FaUser, FaUsers } from 'react-icons/fa';

const menuItems: MenuItem[] = [
  { label: 'Home', icon: FaHome, link: '/home' },
  { label: 'Team', icon: FaUsers, link: '/teams' },
  { label: 'Day-Planner', icon: FaCalendar, link: '/day-planner' },
];

export default menuItems;
