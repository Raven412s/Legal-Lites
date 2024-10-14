"use client"
import DisplayCard from '@/components/cards/DisplayCard'
import ImageUploader from '@/components/image-upload-dnd/ImageUploader';
import { fetchLawyers } from '@/functions/lawyer';
import { fetchTeams } from '@/functions/team';
import React, { useEffect, useState } from 'react'

const HomePage = () => {
    const [lawyerCount, setLawyerCount] = useState<string>("0");
    const [teamCount, setTeamCount] = useState<string>("0");
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleImageUpload = (url: string) => {
      setImageUrl(url);
    };

    useEffect(() => {
        // Fetch lawyers and update options when the component mounts
        const loadLawyers = async () => {
            const { count } = await fetchLawyers();
            setLawyerCount(count.toString());
        };
        loadLawyers();
    }, []);

    useEffect(() => {
        // Fetch lawyers and update options when the component mounts
        const loadTeams = async () => {
            const { count } = await fetchTeams();
            setTeamCount(count.toString());
        };
        loadTeams();
    }, []);


        return (
            <main className=''>
            <div className="flex gap-5 p-5 mb-10">
            <DisplayCard count={lawyerCount} text='Lawyers'/>
            <DisplayCard count={teamCount} text='Teams'/>
            </div>
            <div className="flex text-center h-[80vh] items-center justify-center">
            <p className='text-4xl font-bold'>This is the Home Page</p>
            </div>

            {/* <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold">Image Uploader</h1>
      <ImageUploader onUpload={handleImageUpload} />
      {imageUrl && (
        <div className="mt-4">
          <h2 className="text-xl">Uploaded Image:</h2>
          <img src={imageUrl} alt="Uploaded" className="max-w-md w-auto rounded-md" />
        </div>
      )}
    </div> */}
        </main>
    )
}

export default HomePage
