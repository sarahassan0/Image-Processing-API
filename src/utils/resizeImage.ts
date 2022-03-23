import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
async function resizeImage(req: Request, res: Response): Promise<void> {
  const filename = req.query.filename as unknown as string;
  const xwidth = req.query.width as unknown as string;
  const xheight = req.query.height as unknown as string;
  const width: number = parseInt(xwidth, 10);
  const height: number = parseInt(xheight, 10);
  const orgImage =
    path.join(process.cwd(), 'images', 'originalImages', filename) +
    '.jpg';
  const newImage =
    path.join(process.cwd(), 'images', 'newImages', filename) +
    `_${width}_${height}.jpg`;

    console.log(process.cwd());
    
  try {
    if (fs.existsSync(newImage)) {
      res.sendFile(newImage);
      console.log('this image is already exists');
    } else {
      await sharp(orgImage).resize(width, height).toFile(newImage);
      res.sendFile(newImage);
    }
  } catch (error) {
    res
      .status(500)
      .send('cannot resize this image, please check your image name');
console.log(error);

      
  }
}
export default resizeImage;
