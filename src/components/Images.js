import React from 'react'
import axios from 'axios'
import {useQuery} from '@tanstack/react-query'
const fetchImagesAPI=async(prompt)=>{
    const res=await axios.get("http://www.localhost:9000/images");
    return res.data;
}
const Images = () => {
    const {data,isPending, isError, error, isSuccess}=useQuery({queryFn:fetchImagesAPI,queryKey:['images']})
    console.log(data);
    //loading
    if(isPending)
    return <h2>Loading! wait</h2>;
    
    return <div>
        {data?.map((image)=>{
            return <img src={image.url}></img>
        })}
    </div>;
};


export default Images