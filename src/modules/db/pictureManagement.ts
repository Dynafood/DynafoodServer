import { rejects } from 'assert';
import { Request, Response } from 'express'
import { resolve } from 'path';
var cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dkpqcxbyb",
    api_key: "583496953428893",
    api_secret: "XLTVoUdFz8-GWwUnvFrISybPdiM"
});

const opts = {
    overwrite: true,
    invalidate: true,
    ressoure_type: "auto"
};

export const uploadImageSub = async (image : any) : Promise<string> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, (error:any, result: any) => {
            if (result && result.secure_url){
                console.log(result.secure_url)
                return resolve(result.secure_url);
            }
            else{
            console.log(error.message)
            return reject(error.message)}
    })
})
}


export const uploadImageEnd = async (req: Request, res: Response) : Promise<void> => {

    const urltest = await uploadImageSub(req.body.image).then((url) => res.status(200).send(url)).catch((err) => res.status(500).send(err))
}

