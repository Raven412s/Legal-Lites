import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from 'lucide-react';
import { FaClone } from 'react-icons/fa';

 type ActionsPropType={
    editFunction: Function,
    deleteFunction: Function,
       copyFunction: Function,
       viewFunction: Function
   }


const Actions = ({editFunction, deleteFunction, copyFunction, viewFunction }:ActionsPropType) => {
  return (
 <>
 <div className="flex my-1 items-center justify-start"> {/* Container for the icon buttons */}
      <Button
        size="icon"
        variant="ghost"
        className=""
        onClick={() => viewFunction()}
        aria-label="View"
      >
        <Eye className="h-5 w-5 " />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className=""
        onClick={() => copyFunction()}
        aria-label="View"
      >
        <FaClone className="h-5 w-5 text-green-400" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="text-blue-500 hover:text-blue-700"
        onClick={() => editFunction()}
        aria-label="Edit"
      >
        <Edit className="h-5 w-5" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="text-red-500 hover:text-red-700"
        onClick={() => deleteFunction()}
        aria-label="Delete"
      >
        <Trash className="h-5 w-5" />
      </Button>
    </div>
 </>
  )
}

export default Actions
