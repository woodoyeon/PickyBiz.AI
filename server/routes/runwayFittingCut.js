// /routes/runwayFittingCut.js
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import RunwayML, { TaskFailedError } from '@runwayml/sdk';
import { uploadBufferToSupabase } from '../utils/uploadBufferToSupabase.js';

dotenv.config();
const router = express.Router();
const client = new RunwayML({ apiKey: process.env.RUNWAYML_API_SECRET });

function getPromptByCut(cut) {
  switch (cut) {
    case 'full-body':
      return 'A full-body fashion catalog photo of the model wearing the specified clothing.';
    case 'side-view':
      return 'A side-view fashion photo of the model wearing the specified clothing.';
    case 'back-view':
      return 'A back-view fashion photo of the model wearing the specified clothing.';
    default:
      return 'A fashion photo of the model wearing the specified clothing.';
  }
}

router.post('/', async (req, res) => {
  try {
    const { cut, referenceImages } = req.body;

    if (!cut || !referenceImages || !Array.isArray(referenceImages)) {
      return res.status(400).json({ error: "'cut' and 'referenceImages' (as an array) are required." });
    }

    const modelImage = referenceImages.find(img => img.tag === 'model');
    const styleImage = referenceImages.find(img => img.tag === 'style');
    
    if (!modelImage || !styleImage) {
        return res.status(400).json({ error: "A 'model' and 'style' image must be provided in referenceImages." });
    }

    const promptText = getPromptByCut(cut);
    console.log(`🖼️ Runway 요청 - cut: ${cut}, prompt: ${promptText}`);

    // Ensure all URIs are valid public URLs
    for (const ref of referenceImages) {
        if (ref.uri.startsWith('blob:')) {
            throw new Error(`Invalid image URI: ${ref.uri}. Cannot process blob URLs.`);
        }
    }

    const task = await client.textToImage.create({
      model: 'gen4_image', 
      ratio: '1024:1024', 
      promptText,
      referenceImages: referenceImages,
    }).waitForTaskOutput();

    console.log("Full task object:", task);
    console.log("Task outputs:", task?.outputs); // This will still be undefined, but kept for debugging if needed
    console.log("First task output:", task?.output?.[0]); // Corrected access

    const outputUrl = task?.output?.[0]; // Corrected access
    if (!outputUrl) {
      throw new Error('Runway result did not contain an image URL.');
    }
    console.log(`✅ 이미지 생성 완료: ${outputUrl}`);

    const imageBuffer = await axios.get(outputUrl, { responseType: 'arraybuffer' }).then(r => r.data);
    const supabaseUrl = await uploadBufferToSupabase(imageBuffer, `fitted-${cut}-${Date.now()}.png`, 'fitted-cuts');

    return res.json({ outputUrl: supabaseUrl || outputUrl });

  } catch (err) {
    console.error(`❌ ${req.body.cut || 'Image'} 생성 실패:`, err.message);
    if (err instanceof TaskFailedError) {
      return res.status(500).json({ error: 'Runway Task 실패', detail: err.taskDetails });
    }
    return res.status(500).json({ error: err.message });
  }
});

export default router;
