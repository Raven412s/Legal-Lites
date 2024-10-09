import React, { useState } from 'react';
import { FaBars, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import menuItems from '../providers/menu-items';
import { SidebarProps, MenuItem } from '@/interfaces/interface';
import Image from 'next/image';
import logo from '../../public/images/logo-icon.png'
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Sidebar: React.FC<SidebarProps> = ({ isMinimized, onToggle }) => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  const handleToggle = (label: string) => {
    setOpenItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderMenuItem = (item: MenuItem) => (
    <li key={item.label}>
      <Collapsible open={openItems[item.label]} onOpenChange={() => item.children && handleToggle(item.label)}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={`w-full justify-start text-gray-300 hover:bg-gray-700 rounded-md ${
              isMinimized ? 'justify-center p-2' : 'px-4'
            }`}
            onClick={() => !item.children && item.link && router.push(item.link)}
          >
            <item.icon size={24} />
            {!isMinimized && (
              <div className="flex justify-between items-center w-full ml-4">
                <span className="text-sm font-medium">{item.label}</span>
                {item.children && (
                  openItems[item.label] ? (
                    <FaChevronDown className="ml-auto" />
                  ) : (
                    <FaChevronRight className="ml-auto" />
                  )
                )}
              </div>
            )}
          </Button>
        </CollapsibleTrigger>

        {item.children && (
          <CollapsibleContent className={`pl-6 mt-2 space-y-2 ${isMinimized ? 'hidden' : ''}`}>
            {item.children.map((child) => (
              <Button
                key={child.label}
                variant="ghost"
                asChild
                className="w-full justify-start text-gray-300 hover:bg-gray-600 rounded-md"
              >
                <Link href={child.link!}>
                  <child.icon size={20} />
                  <span className="ml-4 text-sm font-medium">{child.label}</span>
                </Link>
              </Button>
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </li>
  );

  return (
    <div
      className={`bg-zinc-900 h-screen transition-all duration-300 flex flex-col justify-between ${
        isMinimized ? 'w-20' : 'w-72'
      }`}
    >
      <div className="flex flex-col gap-4">
        {/* Brand Logo Section */}
   <Link href={"/home"}>
   <div className={`my-3 flex items-center ${isMinimized ? 'justify-center': 'justify-start ml-5'}`}>
          {isMinimized ? (
            <span className='px-2 py-3 border-2 rounded-full'>
              <Image src={logo} alt="Logo" width={32} height={32}/>
            </span>
          ) : (
            <span className='flex items-center gap-2'>
              <span className='px-2 py-3 border-2 rounded-full'>
                <Image src={logo} alt="Logo" width={32} height={32}/>
              </span>
              <span className="text-white text-2xl font-extrabold">Legal-Lites</span>
            </span>
          )}
        </div>
   </Link>

        {/* Menu Items */}
        <ScrollArea className="flex-grow">
          <ul className="space-y-4">
            {menuItems.map(renderMenuItem)}
          </ul>
        </ScrollArea>
      </div>

      {/* Hamburger Menu Button */}
      <div className={`p-4 flex ${isMinimized ? 'justify-center' : 'justify-end'}`}>
        <Button variant="ghost" onClick={onToggle} className="text-white p-2">
          <FaBars size={24} />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
