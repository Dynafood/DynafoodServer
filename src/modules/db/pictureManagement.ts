import { rejects } from 'assert';
import { Request, Response } from 'express'
import { resolve } from 'path';
import { v2 as cloudinary } from "cloudinary";


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

export const uploadImages = async (images : any) : Promise<Array<any>> => {
    let ar: Array<any> = []
    for (let image of images) {
        let res = await cloudinary.uploader.upload(image.path);
        ar.push(res.secure_url)
    }
    return ar;
}


export const uploadImageEnd = async (req: Request, res: Response) : Promise<void> => {
    // console.log(req)

    // const urltest = await uploadImageSub(req.body.image).then((url) => res.status(200).send(url)).catch((err) => res.status(500).send(err))
    // console.log(urltest)
}

