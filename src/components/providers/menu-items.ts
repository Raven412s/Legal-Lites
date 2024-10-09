// menuItems.ts
import { MenuItem } from '@/interfaces/interface';
import { FaBell, FaCalendarAlt, FaHome, FaTasks, FaUser, FaUsers, FaChevronDown, FaChevronRight } from 'react-icons/fa';

const menuItems: MenuItem[] = [
  { label: 'Home', icon: FaHome, link: '/home' },
  {
    label: 'Teams',
    icon: FaUsers,
    children: [
      { label: 'Manage Team', icon: FaTasks, link: '/teams/view' },
      { label: 'Create Team', icon: FaTasks, link: '/teams/add' },
    ],
  },
  { label: 'Profile', icon: FaUser, link: '/profile' },
  { label: 'Appointments', icon: FaCalendarAlt, link: '/appointments' },
  { label: 'Notifications', icon: FaBell, link: '/notifications' },
];

export default menuItems;
