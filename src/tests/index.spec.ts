import supertest from 'supertest';
import app from '../index';
import fs from 'fs';
import {posix as path} from 'path';
import sharp from 'sharp';
const request = supertest(app);

describe('test /api endpoint response', () => {
  it('api endpoint get request response will returns 200', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
  });
});

describe('test /api/image endpoint response', () => {
  it('api/images endpoint get request response will returns 200', async () => {
    const response = await request.get('/api/images');
    expect(response.status).toBe(200);
  });
});

describe('test image processing', () => {
  const filename = 'fjord';
  const width = 200;
  const height = 200;
  const orgImage= path.resolve(__dirname, '..', 'images', 'originalImages', filename) +
  '.jpg';
  const newImage =
    path.resolve(__dirname, '..', 'images', 'newImages', filename) +
    `_${width}_${height}.jpg`;

  function processImage ( filePath:string , width :number , height:number , thumbPath:string):void {
    sharp(filePath)
      .resize(width,height)
      .toFile(thumbPath);
  }

  it('endpoint returns error when {image name | width | height} is missing or less than 3 char/numbers', async () => {
    const response = await request.get(
      `/api/images?filename='${filename}'&width=${width}&height=`
    );
    expect(response.text).toBe(
      'you have an invalid inputs, check the image name and the dimensions'
    );
  });

  it('endpoint returns error when user enter invalid image name', async () => {
    const response = await request.get(
      `/api/images?filename=ffff&width=${width}&height=${height}`
    );
    expect(response.status).toBe(500);
  });

  it('endpoint returns the processed image', async () => {
    const response = await request.get(
      `/api/images?filename=${filename}&width=${width}&height=${height}`
    );
    expect(response.type).toEqual('image/jpeg');
  });

  it('returns the image if it already exists', async () => {
    const image = request.get(
      `/api/images?filename=${filename}&width=${width}&height=${height}`
    );
    await image;
    expect(fs.existsSync(newImage)).toBeTrue;
  });

  it(' image processing func do not returns errrors' ,async ()=> {;
    expect(async () => {
      await processImage (orgImage, width ,height, newImage);
    }).not.toThrow();
  });
});
