"use client"
import React, { useContext, useEffect, useState } from 'react'
import { UserDetailContext } from '../_context/UserDetailContext'
import Prompt from '../_data/Prompt';
import axios from 'axios';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Lookup from '../_data/Lookup';
import { DownloadIcon, LayoutDashboard, LoaderIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

function GenerateLogo() {
  const {userDetail, setuserDetail} = useContext(UserDetailContext);
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(false);
  const [logoImage, setLogoImage] = useState();
  const searchParams = useSearchParams();
  const modelType = searchParams.get('type')

  useEffect(() => {
    // if(typeof window != undefined && userDetail?.email) {
    //   const storage = localStorage.getItem('formData')
    //   if(storage) {
    //     setFormData(JSON.parse(storage));
    //     console.log(JSON.parse(storage))
    //   }
    // }
    if (typeof window !== 'undefined' && userDetail?.email) {
      const storage = localStorage.getItem('formData');
      if (storage) {
        try {
          const parsed = JSON.parse(storage);
          setFormData(parsed);
          console.log(parsed);
        } catch (err) {
          console.error('Invalid formData in localStorage', err);
        }
      }
    }
  },[userDetail])

  useEffect(() => {
    if(formData?.title) {
      GenerateAILogo();
    }
  },[formData])

  useEffect(() => {
    if(typeof window != undefined && logoImage) {
      localStorage.clear();
    }
  },[logoImage])

  const GenerateAILogo = async () => {

    if(modelType!= 'Free' &&userDetail?.credits<=0) {
      console.log("Not Enough Credits");
      toast('Not enough credits!!!')
      return ;
    }

    setLoading(true)
    const PROMPT=Prompt.LOGO_PROMPT
      .replace('{logoTitle}', formData?.title)
      .replace('{logoDesc}', formData?.desc)
      .replace('{logoColor}', formData?.palette)
      .replace('{logoDesign}', formData?.design?.title)
      .replace('{logoPrompt}', formData?.design?.prompt);

      console.log(PROMPT);
/*
      Generate Logo Prompt from AI
      Generate Logo Image
      const result = await axios.post('/api/ai-logo-model', {
        prompt:PROMPT,
        email:userDetail?.email,
        title:formData.title,
        desc:formData.desc,
        type:modelType,
        userCredits:userDetail?.credits
      });
      console.log(result?.data);
      setLogoImage(result?.data?.image)
      setLoading(false)
      */

      try {
      const result = await axios.post('/api/ai-logo-model', {
        prompt: PROMPT,
        email:userDetail?.email,
        title:formData.title,
        desc:formData.desc,
        type:modelType,
        userCredits:userDetail?.credits
      });
      console.log(result?.data);
      setLogoImage(result?.data?.image)
      setLoading(false)
    } catch (error) {
      console.error('Failed to generate logo', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
    }
  }
  

  const onDownload = () => { 
    console.log(logoImage);
    const imageWindow = window.open();
    imageWindow.document.write(`<img src="${logoImage}" alt="Base64 Image" />`)
  }

  
  return (
    <div className='mt-16 flex flex-col items-center justify-center'>
      {/* <h2>{loading&&'Loading...'}</h2>
      {!loading&&<Image src={logoImage} alt="logo" width={200} height={200}/>} */}

      <h2 className='font-bold text-3xl text-primary'>{Lookup.LoadingWaitTitle}</h2>
      {loading&& <div className='flex flex-col items-center mt-2'>
        <p className='text-xl text-gray-500'>{Lookup.LoadingWaitDesc}</p>
        <LoaderIcon className='animate-spin' />
        <Image src={'/loading.gif'} alt='loading' width={200} height={200} />
        <h2 className='mt-2 font-medium text-2xl text-gray-500'>Do Not Refresh</h2>
      </div>}

      {logoImage&&<div className='mt-5'>
        <Image src={logoImage} alt='logo' width={300} height={300} className='rounded-xl' />

        <div className='mt-4 flex items-center gap-5'>
          <Button onClick={() =>onDownload()}> <DownloadIcon/> Download </Button>
          <Button variant="outline"> <LayoutDashboard/> Dashboard</Button>
        </div>
        </div>}
    </div>
  )
}

// function GenerateLogo() {
//   const {userDetail, setuserDetail} = useContext(UserDetailContext);
//   const [formData, setFormData] = useState({});
  
//   useEffect(() => {
//     if (typeof window !== 'undefined' && userDetail?.email) {
//       const storage = localStorage.getItem('formData');
//       if (storage) {
//         try {
//           const parsed = JSON.parse(storage);
//           setFormData(parsed);
//           console.log(parsed);
//         } catch (err) {
//           console.error('Invalid formData in localStorage', err);
//         }
//       }
//     }
//   },[userDetail])

//   useEffect(() => {
//     if(formData?.title) {
//       GenerateAILogo();
//     }
//   },[formData])

//   const GenerateAILogo = async() => {
//     const PROMPT = Prompt.LOGO_PROMPT
//       .replace('{logoTitle}', formData?.title || '')
//       .replace('{logoDesc}', formData?.desc || '')
//       .replace('{logoColor}', formData?.palette || '')
//       .replace('{logoDesign}', formData?.design?.title || '')
//       .replace('{logoPrompt}', formData?.design?.prompt || '');

//     console.log(PROMPT);

//     // generate logo prompt from AI
//     // generate logo image
//     try {
//       const result = await axios.post('/api/ai-logo-model', {
//         prompt: PROMPT
//       });
//       console.log(result?.data);
//     } catch (error) {
//       console.error('Failed to generate logo', {
//         status: error?.response?.status,
//         data: error?.response?.data,
//         message: error?.message,
//       });
//     }
//   }

//   return (
//     <div>GenerateLogo</div>
//   )
// }

export default GenerateLogo