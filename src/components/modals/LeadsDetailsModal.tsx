import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ILeads } from '@/interfaces/interface';
import Actions from '../actions';
import { Separator } from '../ui/separator';

interface LeadsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: ILeads | null;
  handleView: Function,
  handleEdit: Function,
  handleDelete: Function,
  handleCopy: Function
}

export const LeadsDetailsModal: React.FC<LeadsDetailsModalProps> = ({ isOpen, onClose, leads, handleEdit, handleDelete, handleCopy, handleView }) => {
  if (!leads) return null; // Return null if no leads data

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
      <DialogContent className='min-w-[70vw] max-h-[90%] overflow-scroll '>
        <DialogHeader className='flex w-full justify-between flex-row items-center'>
          <DialogTitle>Leads Details</DialogTitle>
         <Actions
        // viewFunction={() => handleView(leads)}
        editFunction={() => handleEdit(leads)}
        deleteFunction={() => handleDelete(leads)}
        copyFunction={() => handleCopy(leads)}
      />
        </DialogHeader>
        <div className="flex w-full p-[2.5%] gap-[5%]">
  {/* Left side: Details Section (60%) */}
  <div className="w-[60%] space-y-4 p-4 card-shadow rounded-lg">
    <div className="flex flex-1 gap-4 w-full">
      <div className='flex flex-1 flex-col gap-2'>
        <strong>Name:</strong>
        <div className="card-shadow glassmorphism">{leads.name}</div>
      </div>
    </div>
    <div className="flex flex-1 gap-4 w-full">
      <div className='flex flex-1 flex-col gap-2'>
        <strong>Lead Source:</strong>
        <div className="card-shadow glassmorphism">{leads.leadSource}</div>
      </div>
      <div className='flex flex-1 flex-col gap-2'>
        <strong>Phone:</strong>
        <div className="card-shadow glassmorphism">{leads.phone}</div>
      </div>
    </div>
    <div className="flex flex-1 gap-4 w-full">
      <div className='flex flex-1 flex-col gap-2'>
        <strong>Next follow-up:</strong>
        <div className="card-shadow glassmorphism">{formatDate(leads.nextFollowUp)}</div>
      </div>
      <div className='flex flex-1 flex-col gap-2'>
        <strong>Court:</strong>
        <div className="card-shadow glassmorphism">{leads.court}</div>
      </div>
    </div>
    <div className="flex flex-1 gap-4 w-full">
      <div className='flex flex-1 flex-col gap-2'>
        <strong>Case Type:</strong>
        <div className="card-shadow glassmorphism">{leads.caseType ? leads.caseType : "NA"}</div>
      </div>
      <div className='flex flex-1 flex-col gap-2'>
        <strong>Strong:</strong>
        <div className="card-shadow glassmorphism">{leads.strong ? 'Yes' : 'No'}</div>
      </div>
    </div>
    <div className="flex flex-1 gap-4 w-full">
      <div className='flex flex-1 flex-col gap-2'>
        <strong>Status:</strong>
        <div className="card-shadow glassmorphism">{leads.status}</div>
      </div>
      <div className='flex flex-1 flex-col gap-2'>
        <strong>Comment:</strong>
        <div className="card-shadow glassmorphism">{leads.comment ? leads.comment : "NA"}</div>
      </div>
    </div>
  </div>

  {/* Right side: Follow-up Records Section (30%) */}
  <div className="w-[40%] card-shadow rounded-lg p-4 h-full">
    <div className='flex w-full flex-col gap-2'>
      <strong>Follow-up Records:</strong>
      <ul className="h-full w-full">
  {leads.followUpRecord && leads.followUpRecord.length > 0 ? (
    leads.followUpRecord.map((record, index) => (
      <li key={index} className="flex gap-2 !p-2 items-center glassmorphism card-shadow justify-start mb-2">
        <span className="text-blue-500 text-xs">{formatDate(record.nextFollowUp)}</span>
        <Separator orientation='vertical' className="h-4" style={{ backgroundColor: '#c1c2c390', width: '0.5px' }} />
        <span className="text-zinc-500 text-normal">{record.comment}</span>
      </li>
    ))
  ) : (
    <li>No follow-up records available</li>
  )}
</ul>

    </div>
  </div>
</div>

      </DialogContent>
    </Dialog>
  );
};
