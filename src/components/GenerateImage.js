import React, { useState } from 'react'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import Images from './Images';

const generateImageAPI=async(prompt)=>{
    const res=await axios.post("http://www.localhost:9000/generate-image",
    {
        prompt,
    });
    return res.data;
};

const GenerateImage = () => {
    const [prompt,setPrompt]=useState('')
    const mutation=useMutation({
        mutationFn:generateImageAPI,
        mutationKey:['dalle']
    })
    const handleGenerateImage=()=>{
        if(!prompt)
        {
            alert("Enter Prompt");
            return;
        }
        mutataion.mutate(prompt);
    };

    console.log(mutation);
  return (
    <div>
        <input 
        type='text'
        placeholder='Enter prompt'
        value={prompt}
        onChange={(e)=>setPrompt(e.target.value)}
        />
        <button type='submit' onClick={handleGenerateImage}>{mutation?.isPending?"Generating":'generate'} </button>
        <Images/>
    </div>
  )
}

export default GenerateImage