import express, { Request, Response } from 'express';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface GenerateRequestBody {
    prompt: string;
    negative_prompt: string;
    num_images: number;
    aspect_ratio: string;
    seed?: number;
    cfg_scale?: number;
    num_inference_steps?: number;
}

function saveBase64Image(base64Data: string, filePath: string) {
    const publicDir = path.dirname(filePath);
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
}

app.get('/', (req: Request, res: Response) => {
    res.render('index');
});

app.post('/generate-sync', async (req: Request, res: Response) => {
    const {
        prompt,
        negative_prompt,
        num_images,
        aspect_ratio,
        seed,
        cfg_scale,
        num_inference_steps
    }: GenerateRequestBody = req.body;

    // Convert aspect_ratio to width and height
    let width: number, height: number;
    switch (aspect_ratio) {
        case 'square':
            width = height = 512;
            break;
        case 'landscape':
            width = 768;
            height = 512;
            break;
        case 'portrait':
            width = 512;
            height = 768;
            break;
        default:
            width = height = 512;
    }

    try {
        const response = await axios.post(
            `https://api.runpod.ai/v2/${process.env.serverless_api_id}/runsync`,
            {
                input: {
                    prompt,
                    negative_prompt,
                    bactch: parseInt(num_images.toString()),
                    width,
                    height,
                    seed: seed ? parseInt(seed.toString()) : undefined,
                    cfg_scale: cfg_scale ? parseFloat(cfg_scale.toString()) : undefined,
                    steps: num_inference_steps ? parseInt(num_inference_steps.toString()) : undefined
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.api_key}`
                }
            }
        );

        const images = response.data.output.images;
        const imageUrls: string[] = [];

        images.forEach((imageBase64: string, index: number) => {
            const imagePath = path.join(__dirname, `../public/generated-image-${index}.png`);
            saveBase64Image(imageBase64, imagePath);
            imageUrls.push(`/generated-image-${index}.png`);
        });

        res.render('result', { imageUrls });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).send('Something went wrong.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});   