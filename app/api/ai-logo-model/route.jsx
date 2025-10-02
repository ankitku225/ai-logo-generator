import { db } from "@/app/configs/FirebaseConfig";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import Replicate from "replicate";
import axios from "axios";

const { AILogoPrompt } = require("@/app/configs/AiModel");
const { NextResponse } = require("next/server");

export async function POST(req) {

    const { prompt, email, title, desc, type, userCredits } = await req.json();
    let base64ImageWithMine = '';
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });
    try {
        // Generate AI Text Prompt for Logo
        const AiPromptResult = await AILogoPrompt.sendMessage(prompt)
        console.log(JSON.parse(AiPromptResult.response.text()).prompt);
        const AIPrompt = JSON.parse(AiPromptResult.response.text()).prompt;

        //Generate Logo From AI Modal
        if (type == 'Free') {
            // Simple, reliable free provider (no token): Pollinations
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(AIPrompt)}?width=1024&height=1024&nologo=true`;
            const imageResp = await axios.get(url, { responseType: 'arraybuffer' });
            const buf = Buffer.from(imageResp.data, 'binary');
            const mime = imageResp.headers['content-type'] || 'image/png';
            base64ImageWithMine = `data:${mime};base64,${buf.toString('base64')}`;
        } else {
            // Replicate APi en dpoint
            const output = await replicate.run(
                "bytedance/hyper-flux-8step:16084e9731223a4367228928a6cb393b21736da2a0ca6a5a492ce311f0a97143",
                {
                    input: {
                        seed: 0,
                        width: 848,
                        height: 848,
                        prompt: AIPrompt,
                        num_outputs: 1,
                        aspect_ratio: "1:1",
                        output_format: "png",
                        guidance_scale: 3.5,
                        output_quality: 80,
                        num_inference_steps: 8
                    }
                }
            );

            // Output is typically an array of URLs
            const outUrl = Array.isArray(output) ? output[0] : output;
            console.log('replicate output:', outUrl);
            base64ImageWithMine = await ConvertImageBase64(outUrl);

            // After you have base64ImageWithMime
            try {
                const docRef = doc(db, 'users', email);
                await updateDoc(docRef, { credits: Number(userCredits) - 1 });
            } catch (e) {
                console.warn('credits update failed:', e); // Don’t throw here
            }
            return NextResponse.json({ image: base64ImageWithMine });

            /*  const docRef = doc(db,'users',email)
              await updateDoc(docRef, {
                  credits:Number(userCredits) - 1
              })   */

        }


        // save to Firebase database (non-blocking)
        try {
            await setDoc(doc(db, "users", email, "logos", Date.now().toString()), {
                image: base64ImageWithMine,
                title,
                desc
            });
        } catch (e) {
            console.warn('failed to save logo doc:', e);
        }

        return NextResponse.json({ image: base64ImageWithMine })
        // AI logo Image Modal

    } catch (e) {
        const message = e?.response?.data || e?.message || 'Unknown error';
        const status = e?.response?.status || 500;
        return NextResponse.json({ error: message }, { status });
    }
}

async function ConvertImageBase64(image) {
    if (!image) throw new Error('Invalid image URL');
    const resp = await axios.get(image, { responseType: 'arraybuffer' })
    const base64ImageRaw = Buffer.from(resp.data).toString('base64')
    return `data:image/png;base64,${base64ImageRaw}`
}



/*
export async function POST(req) {

    const { prompt, email, title, desc, type, userCredits } = await req.json();
    let base64ImageWithMine = '';
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });
    try {
        // Generate AI Text Prompt for Logo
        const AiPromptResult = await AILogoPrompt.sendMessage(prompt)
        console.log(JSON.parse(AiPromptResult.response.text()).prompt);
        const AIPrompt = JSON.parse(AiPromptResult.response.text()).prompt;

        //Generate Logo From AI Modal
        if (type == 'Free') {
            const response = await axios.post("https://router.huggingface.co/replicate/v1/models/black-forest-labs/flux-dev-lora/predictions",
                AIPrompt,
                {
                    headers: {
                        Authorization: "Bearer " + process.env.HUGGING_FACE_API_KEY,
                        "Content-Type": "application/json",
                    },
                    responseType: "arraybuffer"
                }
            )
            const buffer = Buffer.from(response.data, "binary");
            const base64Image = buffer.toString("base64");

            base64ImageWithMine = `data:image/png:base64,${base64Image}`;
        } else {
            // Replicate APi en dpoint
            const output = await replicate.run(
                "bytedance/hyper-flux-8step:16084e9731223a4367228928a6cb393b21736da2a0ca6a5a492ce311f0a97143",
                {
                    input: {
                        seed: 0,
                        width: 848,
                        height: 848,
                        prompt: AIPrompt,
                        num_outputs: 1,
                        aspect_ratio: "1:1",
                        output_format: "png",
                        guidance_scale: 3.5,
                        output_quality: 80,
                        num_inference_steps: 8
                    }
                }
            );

            // To access the file URL:
            console.log(output[0].url()); //=> "http://example.com"
            base64ImageWithMine = await ConvertImageBase64(output)

            // After you have base64ImageWithMime
            try {
                const docRef = doc(db, 'users', email);
                await updateDoc(docRef, { credits: Number(userCredits) - 1 });
            } catch (e) {
                console.warn('credits update failed:', e); // Don’t throw here
            }
            return NextResponse.json({ image: base64ImageWithMine });

              const docRef = doc(db,'users',email)
              await updateDoc(docRef, {
                  credits:Number(userCredits) - 1
              })   

        }


        //save to Firebase database
        try {
            await setDoc(doc(db, "users", EmailAddress, "logos", Date.now().toString()), {
                image: base64ImageWithMine,
                title: title,
                desc: desc
            })
        } catch (e) {

        }

        return NextResponse.json({ image: base64ImageWithMine })
        // AI logo Image Modal

    } catch (e) {
        return NextResponse.json({ error: e })
    }
}

async function ConvertImageBase64(image) {
    const resp = await axios.get(image, { responseType: 'arraybuffer' })
    const base64ImageRaw = Buffer.from(resp.data).toString('base64')
    return `data:image/png;base64,${base64ImageRaw}`
}
   */