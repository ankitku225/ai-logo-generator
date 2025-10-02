import { db } from "@/app/configs/FirebaseConfig"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {userEmail, userName} = await req.json()
  
  try {
    // if user exists
    const docRef=doc(db,"users",userEmail);
    const docSnap=await getDoc(docRef);
    if(docSnap.exists())
    {
      return NextResponse.json(docSnap.data())
    }
    else {
      // Insert new User
      const data={
        name:userName,
        email:userEmail,
        credits:5
      }
      await setDoc(doc(db,"users",userEmail),{
        ...data
      })
      return NextResponse.json(data)
    }
  }
  catch(e)
  {

  }
}