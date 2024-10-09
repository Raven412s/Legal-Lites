"use client"
import { AddLawyerForm } from '@/components/forms/LawyerForm'
import React from 'react'

const AddLawyerPage = () => {
  return (
  <main className='min-w-full h-screen flex items-center justify-center'>
      <div className="card w-[60%] p-4 bg-muted-foreground border-primary-foreground border-dashed border-2 backdrop-blur-sm" style={{ boxShadow: 'rgba(128, 128, 128, 0.84) 0px 3px 8px' }}>
        <AddLawyerForm onClose={() => {}} />
    </div>
  </main>
  )
}

export default AddLawyerPage
