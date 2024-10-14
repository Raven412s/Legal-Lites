import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ILawyer } from '@/interfaces/interface';

interface LawyerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyer: ILawyer | null;
}

export const LawyerDetailsModal: React.FC<LawyerDetailsModalProps> = ({ isOpen, onClose, lawyer }) => {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lawyer Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div><strong>Title:</strong> {lawyer.title}</div>
          <div><strong>Name:</strong> {lawyer.name}</div>
          <div><strong>Email:</strong> {lawyer.email}</div>
          <div><strong>Phone:</strong> {lawyer.phone}</div>
          <div><strong>Date of Birth:</strong> {formatDate(lawyer.dob)}</div>
          <div><strong>Designation:</strong> {lawyer.designation}</div>
          <div><strong>BCI Registration No:</strong> {lawyer.bciRegistrationNo}</div>
          <div><strong>Verified:</strong> {lawyer.verified ? 'Yes' : 'No'}</div>
          {/* Add more fields as necessary */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
