import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ILawyer } from '@/interfaces/interface';
import Actions from '../actions';

interface LawyerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyer: ILawyer | null;
  handleView: Function,
  handleEdit: Function,
  handleDelete: Function,
  handleCopy: Function
}

export const LawyerDetailsModal: React.FC<LawyerDetailsModalProps> = ({ isOpen, onClose, lawyer, handleEdit, handleDelete, handleCopy, handleView }) => {
  if (!lawyer) return null; // Return null if no lawyer data

  // Function to format date as DD/MM/YYYY
  const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='min-w-[50vw]'>
        <DialogHeader className='flex w-full justify-between flex-row items-center'>
          <DialogTitle>Lawyer Details</DialogTitle>
         <Actions
        // viewFunction={() => handleView(lawyer)}
        editFunction={() => handleEdit(lawyer)}
        deleteFunction={() => handleDelete(lawyer)}
        copyFunction={() => handleCopy(lawyer)}
      />
        </DialogHeader>
        <div className="space-y-4 p-4 card-shadow rounded-lg ">
          <div className="flex flex-1 gap-4 w-full ">
          <div className='flex flex-1 flex-col gap-2'><strong>Name:</strong> <div className="card-shadow glassmorphism">{lawyer.title} {lawyer.name}</div></div>
          </div>
          <div className="flex flex-1 gap-4 w-full ">
          <div className='flex flex-1 flex-col gap-2'><strong>Email:</strong><div className="card-shadow glassmorphism"> {lawyer.email}</div></div>
          <div className='flex flex-1 flex-col gap-2'><strong>Phone:</strong><div className="card-shadow glassmorphism"> {lawyer.phone}</div></div>
          </div>
          <div className="flex flex-1 gap-4 w-full ">
          <div className='flex flex-1 flex-col gap-2'><strong>Date of Birth:</strong><div className="card-shadow glassmorphism"> {formatDate(lawyer.dob)}</div></div>
          <div className='flex flex-1 flex-col gap-2'><strong>Designation:</strong><div className="card-shadow glassmorphism"> {lawyer.designation}</div></div>
          </div>
          <div className="flex flex-1 gap-4 w-full ">
          <div className='flex flex-1 flex-col gap-2'><strong>BCI Registration No:</strong><div className="card-shadow glassmorphism"> {lawyer.bciRegistrationNo ? lawyer.bciRegistrationNo: "NA"}</div></div>
          <div className='flex flex-1 flex-col gap-2'><strong>Verified:</strong><div className="card-shadow glassmorphism"> {lawyer.verified ? 'Yes' : 'No'}</div></div>
          </div>
          {/* Add more fields as necessary */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
