"use client"
import { AddLawyerForm } from '@/components/forms/Lawyer/AddLawyerForm'
import React from 'react'

const AddLawyerPage = () => {
  return (
  <main className='min-w-full h-screen p-10'>
    <h2 className='text-3xl font-bold'> Add Lawyers </h2>
<div className=" flex items-center justify-center mt-20">
    <div className="card w-[60%] p-4  dark:border-white border-dashed border-2 backdrop-blur-sm" style={{ boxShadow: 'rgba(128, 128, 128, 0.84) 0px 3px 8px' }}>
        <AddLawyerForm onClose={() => {}} lawyerId=''/>
    </div>
    </div>
  </main>
  )
}

export default AddLawyerPage
