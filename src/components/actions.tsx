import React from 'react'
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from 'lucide-react';
import { FaClone } from 'react-icons/fa';

type ActionsPropType={
    editFunction?: Function,
    deleteFunction?: Function,
    copyFunction?: Function,
    viewFunction?: Function
}

const Actions = ({editFunction, deleteFunction, copyFunction, viewFunction }:ActionsPropType) => {
  return (
 <>
 <div className="flex my-1 minw-[80px] items-center justify-start"> {/* Container for the icon buttons */}
      {viewFunction && (
        <Button
          size="icon"
          variant="ghost"
          className=""
          onClick={() => viewFunction()}
          aria-label="View"
        >
          <Eye className="h-5 w-5 " />
        </Button>
      )}
      {copyFunction && (
        <Button
          size="icon"
          variant="ghost"
          className=""
          onClick={() => copyFunction()}
          aria-label="View"
        >
          <FaClone className="h-5 w-5 text-green-400" />
        </Button>
      )}
      {editFunction && (
        <Button
          size="icon"
          variant="ghost"
          className="text-blue-500 hover:text-blue-700"
          onClick={() => editFunction()}
          aria-label="Edit"
        >
          <Edit className="h-5 w-5" />
        </Button>
      )}
      {deleteFunction && (
        <Button
          size="icon"
          variant="ghost"
          className="text-red-500 hover:text-red-700"
          onClick={() => deleteFunction()}
          aria-label="Delete"
        >
          <Trash className="h-5 w-5" />
        </Button>
      )}
    </div>
 </>
  )
}

export default Actions
