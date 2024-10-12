"use client"
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EditLawyerForm } from '@/components/forms/Lawyer/EditLawyerForm'; // Import your form

const EditLawyerPage = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the ID from the URL
  const [lawyerId, setLawyerId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLawyerId(id as string); // Ensure ID is set when available
    }
  }, [id]);

  const handleClose = () => {
    router.push('/lawyers'); // Navigate back to the lawyer list or close the form
  };

  return (
    <div className="container mx-auto">
      {lawyerId ? (
        <EditLawyerForm onClose={handleClose} lawyerId={lawyerId} /> // Pass the lawyerId and onClose handler
      ) : (
        <p>Loading lawyer details...</p>
      )}
    </div>
  );
};

export default EditLawyerPage;
