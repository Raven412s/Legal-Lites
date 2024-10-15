"use client"
import DisplayCard from '@/components/cards/DisplayCard'
import ImageUploader from '@/components/image-upload-dnd/ImageUploader';
import { fetchLawyers } from '@/functions/lawyer';
import { fetchTeams } from '@/functions/team';
import React, { useEffect, useState } from 'react'

const HomePage = () => {
    const [lawyerCount, setLawyerCount] = useState<string>("");
    useEffect(() => {
        // Fetch lawyers and update options when the component mounts
        const loadLawyers = async () => {
            const { count } = await fetchLawyers();
            setLawyerCount(count.toString());
        };
        loadLawyers();
    }, []);

        return (
            <main className=''>
            <div className="flex gap-5 p-5 mb-10">
            <DisplayCard count={lawyerCount} text='Team strength'/>

            </div>
            <div className="flex text-center h-[80vh] items-center justify-center">
            <p className='text-4xl font-bold'>This is the Home Page</p>
            </div>
        </main>
    )
}

export default HomePage
