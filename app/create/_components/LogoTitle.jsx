"use client"
import React, { useEffect } from 'react'
import HeadingDescription from './HeadingDescription'
import Lookup from '@/app/_data/Lookup'
import { useSearchParams } from 'next/navigation'

const LogoTitle = ({ onHandleInputChange, formData }) => {
  const searchParam = useSearchParams();

  // Seed from query param only if parent has no title yet
  useEffect(() => {
    const seeded = searchParam?.get('title') ?? '';
    if (!formData?.title && seeded) {
      onHandleInputChange(seeded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='my-10'>
      <HeadingDescription
        title={Lookup?.LogoTitle}
        description={Lookup.LogoTitleDesc}
      />

      <input
        type='text'
        placeholder={Lookup.InputTitlePlaceholder}
        className='p-4 border rounded-lg mt-5 w-full'
        value={formData?.title || ''}
        onChange={(e) => onHandleInputChange(e.target.value)}
      />
    </div>
  )
}

export default LogoTitle