import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cors from 'cors'
import { config, uploader } from 'cloudinary';
dotenv.config();
import OpenAI from 'openai';

const app = express()
const PORT = 9000

//!Connect mongo
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Mongodb connected");
})
.catch((e=>console.log(e)));

//!Gallery model
const gallerySchema=new mongoose.Schema(
    {
        prompt:String,
        url:String,
        public_id:String,
    },
    {
        timestamps:true,
    }
);
const Gallery=mongoose.model("Gallery",gallerySchema);

//!Configure openai
const openai=new OpenAI({apiKey:process.env.OPENAI_KEY});

//!Confige Cloudinary
config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure:true,
});
//!cors
const corsOptions={
    origin:["http://localhost:3000"],
};
//!MIDDLEWARES
app.use(express.json());
app.use(cors(corsOptions))
//!Route
app.post('/generate-image',async(req,res)=>{
    const{prompt}=req.body
    try{
        const imageResponse=await openai.images.generate({
            model:"dall-e-3",
            prompt,
            n:1,
            size:'1024x1024'
        });
        //saving image
        const image=await uploader.upload(
            imageResponse.data[0].url,{
                folder:"ai-art-work",
            });
            //save into mongo
            const imageCreated=await Gallery.create({
                prompt: imageResponse.data[0].revised_prompt,
                url: imageResponse.data[0].url,
                public_id: image.public_id,
            });
            res.json(imageCreated);
    }catch(error)
    {
        console.log(error);
        res.json({message:"Error generating images"});
    }
})
//!Collecting images
app.get('./images',async(req,res)=>{
    try{
        const images=await Gallery.find();
        res.json(images);
    }
    catch(error){
        res.json({message:"Error fetching images"});
    }
});
//!Start the server
app.listen(PORT,console.log("Server Running"));

// //////////////////////////////////////////
// async function main(){
//     const completion =await openai.chat.completions.create({
//         messages:[
//             {role:"system", content:"You are a helpful assistant."},
//             {role:"user", content:"Who won the world series in 2020?"},
//             {
//                 role:"assistant",
//                 content:"The Los Angeles Dodgers won the World Series in 2020.",
//             },
//             {role:"user", content:"Where was it played?"},
//         ],
//         model:'gpt-3.5-turbo',
//     });
//     console.log(completion.choices[0]);
// }
// main();

let conversationHistory=[
    {role:"system",content:"You are a helpful assistant"},
];
app.post("/ask",async(req,res)=>{
    const userMessage=req.body.message;
    conversationHistory.push({role:"user",content:userMessage});
    try{
        const completion=await openai.chat.completions.create({
            messages:conversationHistory,
            model:"gpt-3.5-turbo",
        });
        const botResponse=completion.choices[0].message.content;
        res.json({message:botResponse});
    }catch(error){
        res.status(500).send("Error generating response");
    }
});