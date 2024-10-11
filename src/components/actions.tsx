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


 type ActionsPropType={
    editFunction: Function,
    deleteFunction: Function,
       copyFunction: Function,
   }


const Actions = ({editFunction, deleteFunction, copyFunction,  }:ActionsPropType) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <Button
          aria-haspopup="true"
          size="icon"
          variant="ghost"
          className='m-1 focus-visible:ring-0 '
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={()=>editFunction()}
        >
          Edit
        </DropdownMenuItem>
       <DropdownMenuItem
          onClick={()=>deleteFunction()}
        >
          Delete
        </DropdownMenuItem> 

        <DropdownMenuItem
          onClick={()=>copyFunction()}
        >
          Copy Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Actions
