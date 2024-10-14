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
      <main className='min-w-full h-screen p-10'>
        <h2 className='text-3xl font-bold'> Update Lawyer </h2>
    <div className="flex items-center justify-center mt-20">
        <div className="card w-[60%] p-4 dark:border-white border-dashed border-2 backdrop-blur-sm" style={{ boxShadow: 'rgba(128, 128, 128, 0.84) 0px 3px 8px' }}>
         <EditLawyerForm onClose={handleClose} lawyerId={lawyerId || ''} />
        </div>
    </div>
      </main>
  );
};

export default EditLawyerPage;
