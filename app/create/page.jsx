"use client"
import React, { useState, useEffect, Suspense } from 'react'
import LogoTitle from './_components/LogoTitle'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import LogoDesc from './_components/LogoDesc'
import LogoPallet from './_components/LogoPallet'
import LogoDesign from './_components/LogoDesign'
import LogoIdea from './_components/LogoIdea'
import PricingModel from './_components/PricingModel'

const CreateLogo = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const onHandleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Avoid logging immediately after setState (stale). See effect below.
  }

  // Persist latest form data to localStorage to ensure Generate page reads fresh values
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('formData', JSON.stringify(formData || {}));
      } catch {}
    }
  }, [formData])
  
  return (
    <div className='mt-28 p-10 border rounded-xl 2xl:mx-72 '>
      {step == 1 ?
          // <LogoTitle onHandleInputChange={(v) => onHandleInputChange('title', v)} formData={formData} /> :
          <Suspense fallback={null}>
            <LogoTitle onHandleInputChange={(v) => onHandleInputChange('title', v)} formData={formData} />
          </Suspense> :
       step == 2 ?
          <LogoDesc onHandleInputChange={(v) => onHandleInputChange('desc', v)} formData={formData} /> :
       step == 3 ?
          <LogoPallet onHandleInputChange={(v) => onHandleInputChange('palette', v)} formData={formData} /> :
       step == 4 ?
          <LogoDesign onHandleInputChange={(v) => onHandleInputChange('design', v)} formData={formData} /> :
       step == 5 ?
          <LogoIdea formData={formData} onHandleInputChange={(v) => onHandleInputChange('idea', v)}  /> :
        step == 6 ?
          <PricingModel formData={formData} onHandleInputChange={(v) => onHandleInputChange('pricing', v)}  /> :  
      null
      }

      <div className='flex items-center justify-between mt-10'>
        {step != 1 && <Button variant="outline" onClick={() => setStep(step - 1)}> <ArrowLeft />Previous</Button>}
        <Button onClick={() => setStep(step + 1)}> <ArrowRight /> Continue</Button>
      </div>
    </div>
  )
}

export default CreateLogo