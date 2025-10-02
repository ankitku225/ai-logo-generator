import { AIDesignIdea } from "@/app/configs/AiModel";
// import {AIDesignIdea} from '../../config/AIDesignIdea'
import { NextResponse } from "next/server";

export async function POST(req) {

    const { prompt } = await req.json();

    try {
        const result = await AIDesignIdea.sendMessage(prompt);
        // Gemini returns a streaming/async text; we must await it
        const text = typeof result?.response?.text === 'function'
            ? await result.response.text()
            : (result?.response?.text || '');

        // Try parsing JSON
        let data;
        try {
            data = typeof text === 'string' ? JSON.parse(text) : text;
        } catch (e) {
            // Try to extract a JSON object from mixed text
            const match = typeof text === 'string' && text.match(/\{[\s\S]*\}/);
            if (match) {
                try { data = JSON.parse(match[0]); } catch {}
            }
        }

        // Normalize to { ideas: string[] }
        let ideas = [];
        if (Array.isArray(data?.ideas)) ideas = data.ideas.filter(i => typeof i === 'string');
        else if (Array.isArray(data)) ideas = data.filter(i => typeof i === 'string');

        if (!ideas.length) {
            return NextResponse.json({ ideas: [] });
        }
        return NextResponse.json({ ideas });
    }
    catch (e) {
        const status = e?.response?.status || 500;
        const message = e?.message || 'Failed to generate design ideas';
        return NextResponse.json({ error: message }, { status });
    }

}


/*
const AIDesignIdea = {
    sendMessage: async (prompt) => {
        // mock response matching what your client expects
        const ideas = [
            'Spice Pattern Sharp Lines',
            'Geometric Elephant Head',
            'Bold Colourful Curry Bowl',
            'Minimal geometric mark',
            'Wordmark with custom ligature',
            'Friendly mascot emblem',
            'Monogram using initials'
        ]
        return {
            response: {
                text: async () => JSON.stringify({ ideas })
            }
        }
    }
}    */
