// src/pages/ProductUpload.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import { uploadFileToSupabase } from '../utils/uploadFileToSupabase';
import Step1ModelConfig from '../components/Step1ModelConfig';
import Step2ImageUpload from '../components/Step2ImageUpload';
import Step3MultiFitted from '../components/Step3MultiFitted';
import Step4VideoGeneration from '../components/Step4VideoGeneration';
import Step5DetailUpload from '../components/Step5DetailUpload';
import Step6TemplateSelector from '../components/Step6TemplateSelector';
import Step7TextGenerator from "../components/Step7TextGenerator";
import Step8FinalPreview from "../components/Step8FinalPreview";
import Footer from '../components/Footer';
import html2pdf from 'html2pdf.js';
import * as htmlToImage from 'html-to-image';

// Helper functions moved from children
function getOccupations(category) {
  switch (category) {
    case 'clothing':
      return ['패션모델', '일반인 여성', '피트니스 모델'];
    case 'agriculture':
      return ['농부', '시장 상인', '밭에서 일하는 사람'];
    case 'electronics':
      return ['제품 설명 리포터', '남성 사용자', '여성 사용자'];
    case 'cosmetics':
      return ['뷰티 인플루언서', '셀럽', 'SNS 모델'];
    default:
      return ['일반인'];
  }
}

function mapBackgroundToPrompt(bg) {
  switch (bg) {
    case "studio": return "in a professional photo studio";
    case "outdoor": return "in an outdoor setting";
    case "white": return "on a white seamless background";
    case "market": return "in a traditional market";
    case "kitchen": return "in a modern kitchen";
    default: return "in a clean environment";
  }
}

function makePromptFromModel(model) {
  const {
    nationality = "Korean",
    age = "20s",
    gender = "female",
    occupation = "model",
    background = "studio",
    category = "generic",
    customPrompt = ""
  } = model;
  if (customPrompt.trim()) return customPrompt;
  const bgText = mapBackgroundToPrompt(background);
  let prompt = `A ${age} ${gender} ${occupation} from ${nationality}, ${bgText}.`;
  switch (category) {
    case "clothing":
      prompt += " Wearing fashionable seasonal outfits.";
      break;
    case "agriculture":
      prompt += " Holding or presenting fresh agricultural products.";
      break;
    case "electronics":
      prompt += " Demonstrating or using an electronic device.";
      break;
    case "cosmetics":
      prompt += " Applying or showcasing beauty products.";
      break;
    default:
      prompt += " Posing with a product in a clean setting.";
  }
  return prompt;
}

export default function ProductUpload() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [userId, setUserId] = useState(null);
  const previewRef = useRef(null);

  console.log('isLoading changed to:', isLoading); // Added log

  // Step 1 State
  const [selectedModel, setSelectedModel] = useState({
    category: '',
    occupation: '',
    nationality: 'Korean',
    age: '20s',
    gender: 'female',
    background: 'studio',
    customPrompt: ''
  });
  const [modelImageUrl, setModelImageUrl] = useState(null);
  const [modelImagePreview, setModelImagePreview] = useState(null);
  const [uploadedModelImage, setUploadedModelImage] = useState(null);

  // Step 2 State
  const [uploadedClothesImage, setUploadedClothesImage] = useState(null);
  const [productMeta, setProductMeta] = useState({
    category: '',
    size: '',
    position: '',
    background: '',
  });
  const [fittedImageUrl, setFittedImageUrl] = useState(null);

  // Step 3 State
  const [multiFittedImages, setMultiFittedImages] = useState([]);

  // Step 4 State
  const [selectedImageForVideo, setSelectedImageForVideo] = useState(null);
  const [videoCategory, setVideoCategory] = useState("의류");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState(null);

  // Step 5 State
  const [detailImages, setDetailImages] = useState(Array(4).fill(null));
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [uploadedDetailList, setUploadedDetailList] = useState([]);

  // Step 6 State
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Step 7 State
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [imgDescs, setImgDescs] = useState(Array(8).fill(''));
  const [longDesc, setLongDesc] = useState('');
  // New states for Step 7 additional info
  const [productName, setProductName] = useState('');
  const [emphasisKeywords, setEmphasisKeywords] = useState('');

  // Step 8 State
  const [safeImages, setSafeImages] = useState({});

  // Dev Mode Settings
  const isDevMode = false;
  const mockFittedImageUrl = 'https://picsum.photos/600/800?random=1';
  const mockDetailImages = [
    'https://picsum.photos/300/400?random=2',
    'https://picsum.photos/300/400?random=3',
    'https://picsum.photos/300/400?random=4',
    'https://picsum.photos/300/400?random=5',
  ];
  const mockMultiFittedImages = [
    'https://picsum.photos/300/400?random=10',
    'https://picsum.photos/300/400?random=11',
    'https://picsum.photos/300/400?random=12',
    'https://picsum.photos/300/400?random=13',
  ];
  const mockGeneratedVideoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
  const mockTitle = '✨ AI 추천 코튼 셔츠';
  const mockShortDesc = '트렌디한 핏의 편안한 착용감!';
  const mockImgDescs = ['전면 착용', '측면 디테일', '소재 강조', '후면 연출'];
  const mockLongDesc = `부드러운 촉감의 코튼 소재로 제작되어 피부에 자극 없이 착용 가능합니다.`;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || null);
    });
  }, []);

  // Step 1 Functions
  const handleGenerateModelImage = async () => {
    console.log('handleGenerateModelImage: setting isLoading to true'); // Added log
    if (!selectedModel.category) return alert('AI 모델 정보를 입력해주세요.');
    setIsLoading(true);
    setLoadingText('DALL·E 3 모델 이미지를 생성하고 있습니다... (약 30초~1분 소요)');
    try {
      const prompt = makePromptFromModel(selectedModel);
      console.log("🧠 생성된 프롬프트:", prompt);
      const res = await axios.post(`${import.meta.env.VITE_EXPRESS_URL}/dalle3`, { prompt });
      const imageUrl = res.data?.url;
      if (!imageUrl) throw new Error('이미지 URL을 받지 못했습니다.');
      setModelImageUrl(imageUrl);
      alert('✅ DALL·E 3 모델 이미지 생성 완료!');
    } catch (err) {
      console.error("❌ DALL·E 요청 실패:", err);
      alert('❌ 서버 오류로 이미지 생성 실패');
    } finally {
      setIsLoading(false); // This should reset it
      setLoadingText('');
      console.log('handleGenerateModelImage: setting isLoading to false'); // Added log
    }
  };

  const applyModelImageToUploadBox = async () => {
    if (!modelImageUrl) return alert("생성된 모델 이미지가 없습니다.");
    setIsLoading(true);
    setLoadingText('이미지를 적용하는 중...');
    try {
      // Fetch the image from the URL
      const response = await fetch(modelImageUrl);
      const blob = await response.blob();
      const file = new File([blob], `model-${Date.now()}.png`, { type: 'image/png' });
      
      // Set the file object for upload and the blob URL for preview
      setUploadedModelImage(file);
      setModelImagePreview(URL.createObjectURL(file)); 
      
      alert("✅ 모델 이미지가 업로드 영역에 적용되었습니다.");
    } catch (err) {
      console.error("❌ 이미지 적용 실패:", err);
      alert("❌ 이미지 적용 중 오류 발생");
    } finally {
      setIsLoading(false);
      setLoadingText('');
    }
  };

  // Step 2 Functions
  const handleFittingRequest = async () => {
    console.log('handleFittingRequest: setting isLoading to true'); // Added log
    setIsLoading(true);
    setLoadingText('가상 피팅 이미지를 생성하고 있습니다... (약 1분 소요)');
    try {
      if (!uploadedModelImage || !uploadedClothesImage) {
        return alert('모델 이미지와 상품 이미지를 모두 업로드해주세요.');
      }

      // 1. Upload model image to Supabase
      const modelPublicUrl = await uploadFileToSupabase(uploadedModelImage, `model-${Date.now()}.png`, 'model-images');
      if (!modelPublicUrl) throw new Error('모델 이미지 업로드 실패');

      // 2. Upload clothes image to Supabase
      const clothesPublicUrl = await uploadFileToSupabase(uploadedClothesImage, `clothes-${Date.now()}.png`, 'clothes-images');
      if (!clothesPublicUrl) throw new Error('상품 이미지 업로드 실패');

      // 3. Check for metadata
      const { category, size, position, background } = productMeta;
      if (!category || !size || !position || !background) {
        return alert('상품 카테고리, 크기, 위치, 배경을 모두 선택해주세요.');
      }

      // 4. Send public URLs to the server
      const payload = { 
        modelImageUrl: modelPublicUrl, 
        styleImageUrl: clothesPublicUrl, 
        fittingMeta: productMeta 
      };
      console.log("📦 전송할 payload:", payload);

      const res = await axios.post(`${import.meta.env.VITE_EXPRESS_URL}/runway-fitting`, payload);
      
      if (res.data?.imageUrl) {
        setFittedImageUrl(res.data.imageUrl);
        alert('✅ 피팅 이미지 생성 완료!');
      } else {
        throw new Error(res.data?.error || '피팅 이미지 URL을 받지 못했습니다.');
      }
    } catch (err) {
      console.error("❌ 피팅 오류:", err);
      alert(`❌ 서버 오류로 이미지 생성 실패: ${err.message}`);
    } finally {
      setIsLoading(false);
      setLoadingText('');
      console.log('handleFittingRequest: setting isLoading to false'); // Added log
    }
  };

  // Step 3 Functions
  const handleRunwayFittingRequest = async () => {
    console.log('handleRunwayFittingRequest: setting isLoading to true'); // Added log
    if (!modelImageUrl || !fittedImageUrl || !uploadedClothesImage) {
      return alert("STEP 2를 먼저 완료해주세요. 모델+상품+피팅 이미지가 필요합니다.");
    }
    setIsLoading(true);
    setLoadingText('다양한 컷의 이미지를 합성하고 있습니다...');
    const cuts = ["full-body", "side-view", "back-view", "half-body"];
    const outputUrls = [];

    const clothesFileUrl = await uploadFileToSupabase(uploadedClothesImage, `clothes-multi-${Date.now()}.png`, 'clothes-images');

    for (let cut of cuts) {
      try {
        const payload = { cut, model: selectedModel, referenceImages: [{ uri: modelImageUrl, tag: "model" }, { uri: clothesFileUrl, tag: "style" }, { uri: fittedImageUrl, tag: "fitting" }] };
        const res = await axios.post(`${import.meta.env.VITE_EXPRESS_URL}/runway-fitting-cut`, payload);
        if (res.data?.outputUrl) {
          outputUrls.push(res.data.outputUrl);
        }
      } catch (err) {
        console.error(`❌ ${cut} 생성 실패`, err);
      }
    }
    setMultiFittedImages(outputUrls);
    setIsLoading(false);
    alert(`✅ ${outputUrls.length}/4장 이미지 생성 완료!`);
    console.log('handleRunwayFittingRequest: setting isLoading to false'); // Added log
  };

  // New function to apply multi-fitted images to detail images
  const handleApplyMultiFittedToDetails = () => {
    if (multiFittedImages.length !== 4) {
      return alert("4장의 이미지가 모두 생성되어야 합니다.");
    }
    // Map multiFittedImages to detailImages based on assumed order
    // full-body -> front (0)
    // side-view -> side (1)
    // back-view -> back (2)
    // half-body -> point (3)
    const newDetailImages = [...detailImages];
    newDetailImages[0] = multiFittedImages[0]; // full-body to front
    newDetailImages[1] = multiFittedImages[1]; // side-view to side
    newDetailImages[2] = multiFittedImages[2]; // back-view to back
    newDetailImages[3] = multiFittedImages[3]; // half-body to point

    setDetailImages(newDetailImages);
    setCurrentStep(5); // Move to Step 5
    alert("✅ 4장의 이미지가 상세 이미지에 적용되었습니다. 5단계로 이동합니다.");
  };

  // Step 4 Functions
  const handleVideoGeneration = async () => {
    if (!selectedImageForVideo) return alert("🎬 사용할 이미지를 먼저 선택해주세요!");
    setIsVideoGenerating(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_EXPRESS_URL}/runway-image-to-video`, { imageUrl: selectedImageForVideo, category: videoCategory });
      if (res.data?.videoUrl) {
        setGeneratedVideoUrl(res.data.videoUrl);
        alert("✅ 영상 생성 완료!");
      } else {
        alert("❌ 영상 생성 실패");
      }
    } catch (err) {
      console.error("❌ 영상 생성 오류:", err);
      alert("❌ 서버 오류로 영상 생성 실패");
    }
  };

  const handleVideoImageUpload = async (file) => {
    try {
      const url = await uploadFileToSupabase(file, `video-source-${Date.now()}.png`, 'video-sources');
      if (!url) throw new Error("업로드 실패");
      setSelectedImageForVideo(url);
      alert("✅ 영상용 이미지 업로드 완료!");
    } catch (err) {
      console.error("❌ 업로드 에러:", err);
      alert("❌ 이미지 업로드 실패");
    }
  };

  // Step 5 Functions
  const fetchUploadedDetailImages = async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase.storage.from('detail-images').list(`${userId}/detail-images`, { sortBy: { column: 'created_at', order: 'desc' } });
      if (error) throw error;
      const urls = data.map(item => supabase.storage.from('detail-images').getPublicUrl(`${userId}/detail-images/${item.name}`).data.publicUrl);
      setUploadedDetailList(urls);
    } catch (err) {
      console.error('❌ 파일 목록 가져오기 실패:', err);
    }
  };

  const handleDetailImageUpload = async (file, index) => {
    if (!file || !userId) return;
    setUploadingIndex(index);
    try {
      const url = await uploadFileToSupabase(file, `detail-${index}-${Date.now()}`, `detail-images/${userId}/detail-images`);
      if (!url) throw new Error(`❌ Supabase 업로드 실패`);
      setDetailImages(prev => {
        const newState = [...prev];
        newState[index] = url;
        return newState;
      });
      // Do not fetch the entire list again, this prevents the duplicate effect
      alert(`✅ 이미지 업로드 완료`);
    } catch (err) {
      console.error(`🔥 업로드 중 오류:`, err);
      alert(`❌ 이미지 업로드 실패`);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleNextStep = () => {
    setCurrentStep(prev => (prev < 8 ? prev + 1 : prev));
  };

  // Step 7 Functions
  const generateTextFromImages = async () => {
    setIsLoading(true);
    console.log('generateTextFromImages: setting isLoading to true'); // Added log
    try {
      // Pass new product name and emphasis keywords to the server
      const res = await axios.post(`${import.meta.env.VITE_EXPRESS_URL}/generate-text-from-urls`, {
        modelImageUrl,
        fittedImageUrl,
        multiFittedImages,
        detailImages,
        generatedVideoUrl,
        productName, // New
        emphasisKeywords, // New
      });
      const { title, shortDesc, imgDescs: gptImgDescs, longDesc } = res.data.result || {};
      const allImageCount = [modelImageUrl, fittedImageUrl, ...(multiFittedImages || []), ...(detailImages || []), generatedVideoUrl].filter(Boolean).length;
      const paddedImgDescs = Array(allImageCount).fill("").map((_, i) => (gptImgDescs?.[i] || ""));
      setTitle(title || "");
      setShortDesc(shortDesc || "");
      setImgDescs(paddedImgDescs);
      setLongDesc(longDesc || "");
      alert("✅ GPT로 글 자동 생성 완료!");
    } catch (err) {
      console.error("❌ GPT 생성 실패:", err);
      alert("❌ 글 자동 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
      console.log('generateTextFromImages: setting isLoading to false'); // Added log
    }
  };

  // Step 8 Functions
  const convertImageToBase64 = async (url) => {
    try {
      const res = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("❌ 이미지 Base64 변환 실패:", url, err);
      return url;
    }
  };

  const prepareImagesForPreview = async () => {
    const convertedModel = modelImageUrl ? await convertImageToBase64(modelImageUrl) : null;
    const convertedFitted = fittedImageUrl ? await convertImageToBase64(fittedImageUrl) : null;
    const convertedMulti = await Promise.all((multiFittedImages || []).map(url => url ? convertImageToBase64(url) : null));
    const convertedDetail = await Promise.all((detailImages || []).map(item => (typeof item === 'string' ? convertImageToBase64(item) : null)));
    setSafeImages({ modelImageUrl: convertedModel, fittedImageUrl: convertedFitted, multiFittedImages: convertedMulti, detailImages: convertedDetail });
  };

  useEffect(() => {
    if (currentStep === 8) {
      prepareImagesForPreview();
    }
  }, [currentStep, modelImageUrl, fittedImageUrl, multiFittedImages, detailImages]);

  // Step 9/10 Functions
  const handleSaveAsPDF = () => {
    if (!previewRef.current) return;
    html2pdf().from(previewRef.current).set({ margin: 0, filename: `product_${Date.now()}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).save();
  };

  const handleSaveAsPNG = async () => {
    if (!previewRef.current) return;
    try {
      const blob = await htmlToImage.toBlob(previewRef.current, {
        fetchRequestInit: { mode: 'cors' }
      });
      if (!blob) throw new Error('PNG 변환 실패');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `product_${Date.now()}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ PNG 저장 실패:", err);
      alert("❌ 이미지 저장 중 오류 발생");
    }
  };

  const handleSave = async () => {
    if (!userId) return alert('로그인 후 이용해주세요.');
    if (!title || !shortDesc || !longDesc) return alert('제목, 설명이 비어있어요.');
    const { error } = await supabase.from('product_details').insert({
      user_id: userId,
      title,
      short_description: shortDesc,
      section1_text: imgDescs[0],
      section2_text: imgDescs[1],
      section3_text: imgDescs[2],
      long_description: longDesc,
      model_image_url: modelImageUrl,
      fitted_image_url: fittedImageUrl,
      status: 'pending'
    });
    if (error) {
      alert(`❌ 저장 실패: ${error.message}`);
    } else {
      alert('✅ 저장 완료! 관리자의 승인을 기다려주세요.');
    }
  };

  function getStepTitle(step) {
    const titles = ["AI 모델 선택", "상품 이미지 업로드", "다양한 상품 모델 합성", "영상 제작", "디테일 이미지 추가", "템플릿 적용", "텍스트 작성", "최종 미리보기"];
    return titles[step - 1];
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <h2 className="text-xl font-bold text-pink-600 mb-6">PickyAI 제품 등록</h2>
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${currentStep * 12.5}%` }}></div>
          </div>
        </div>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
          <button key={step} onClick={() => setCurrentStep(step)} className={`flex items-center p-3 mb-2 rounded-md transition min-w-[200px] ${currentStep === step ? "bg-pink-100 text-pink-700 border-l-4 border-pink-500" : "hover:bg-gray-100"}`}>
            <span className="mr-3 whitespace-nowrap font-medium">STEP {step}</span>
            <span className="whitespace-nowrap">{getStepTitle(step)}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-16">
          <h1 className="text-2xl font-bold mb-6">STEP {currentStep}: {getStepTitle(currentStep)}</h1>

          {currentStep === 1 && (
            <Step1ModelConfig
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              getOccupations={getOccupations}
              handleGenerateModelImage={handleGenerateModelImage}
              isLoading={isLoading}
              loadingText={loadingText}
              isVideoGenerating={isVideoGenerating}
              modelImageUrl={modelImageUrl}
              applyModelImageToUploadBox={applyModelImageToUploadBox}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === 2 && (
            <Step2ImageUpload
              uploadedModelImage={uploadedModelImage}
              setUploadedModelImage={setUploadedModelImage}
              modelImagePreview={modelImagePreview}
              uploadedClothesImage={uploadedClothesImage}
              setUploadedClothesImage={setUploadedClothesImage}
              productMeta={productMeta}
              setProductMeta={setProductMeta}
              handleFittingRequest={handleFittingRequest}
              isLoading={isLoading}
              loadingText={loadingText}
              isVideoGenerating={isVideoGenerating}
              fittedImageUrl={fittedImageUrl}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === 3 && (
            <Step3MultiFitted
              handleRunwayFittingRequest={handleRunwayFittingRequest}
              isLoading={isLoading}
              multiFittedImages={multiFittedImages}
              selectedImageForVideo={selectedImageForVideo}
              setSelectedImageForVideo={setSelectedImageForVideo}
              handleNextStep={handleNextStep}
              handleApplyMultiFittedToDetails={handleApplyMultiFittedToDetails}
            />
          )}
          {currentStep === 4 && (
            <Step4VideoGeneration
              selectedImageForVideo={selectedImageForVideo}
              handleVideoImageUpload={handleVideoImageUpload}
              videoCategory={videoCategory}
              setVideoCategory={setVideoCategory}
              handleVideoGeneration={handleVideoGeneration}
              isVideoGenerating={isVideoGenerating}
              generatedVideoUrl={generatedVideoUrl}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === 5 && (
            <Step5DetailUpload
              detailImages={detailImages}
              handleDetailImageUpload={handleDetailImageUpload}
              uploadingIndex={uploadingIndex}
              uploadedList={uploadedDetailList}
              fetchUploadedImages={fetchUploadedDetailImages}
              userId={userId}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === 6 && (
            <Step6TemplateSelector
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              modelImageUrl={isDevMode ? null : modelImageUrl}
              fittedImageUrl={isDevMode ? mockFittedImageUrl : fittedImageUrl}
              detailImages={isDevMode ? mockDetailImages : detailImages}
              generatedVideoUrl={isDevMode ? mockGeneratedVideoUrl : generatedVideoUrl}
              title={isDevMode ? mockTitle : title}
              shortDesc={isDevMode ? mockShortDesc : shortDesc}
              imgDescs={isDevMode ? mockImgDescs : imgDescs}
              longDesc={isDevMode ? mockLongDesc : longDesc}
              multiFittedImages={isDevMode ? mockMultiFittedImages : multiFittedImages}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === 7 && (
            <Step7TextGenerator
              generateText={generateTextFromImages}
              isLoading={isLoading}
              title={title}
              setTitle={setTitle}
              shortDesc={shortDesc}
              setShortDesc={setShortDesc}
              imgDescs={imgDescs}
              setImgDescs={setImgDescs}
              longDesc={longDesc}
              setLongDesc={setLongDesc}
              productName={productName} // New
              setProductName={setProductName} // New
              emphasisKeywords={emphasisKeywords} // New
              setEmphasisKeywords={setEmphasisKeywords} // New
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === 8 && (
            <div ref={previewRef}>
              <Step8FinalPreview
                selectedTemplate={selectedTemplate}
                safeImages={safeImages}
                generatedVideoUrl={isDevMode ? mockGeneratedVideoUrl : generatedVideoUrl}
                title={isDevMode ? mockTitle : title}
                setTitle={setTitle}
                shortDesc={isDevMode ? mockShortDesc : shortDesc}
                setShortDesc={setShortDesc}
                imgDescs={isDevMode ? mockImgDescs : imgDescs}
                setImgDescs={setImgDescs}
                longDesc={isDevMode ? mockLongDesc : longDesc}
                setLongDesc={setLongDesc}
              />
            </div>
          )}

          {currentStep === 8 && (
            <>
              <section className="flex flex-col md:flex-row justify-center gap-4 mt-4">
                <button onClick={handleSaveAsPDF} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">📄 PDF 저장하기</button>
                <button onClick={handleSaveAsPNG} className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600">🖼 PNG 저장하기</button>
              </section>
              <section className="flex justify-center mt-4">
                <button onClick={handleSave} className="bg-green-500 text-white px-6 py-3 rounded-md shadow hover:bg-green-600">✅ 관리자에게 승인 요청 및 업로드</button>
              </section>
            </>
          )}

          <Footer />
        </div>
      </div>

      <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">🔍미리보기</h3>
        {currentStep === 1 && (
          <div>
            <img src={modelImageUrl || "/placeholder.svg"} alt="모델 미리보기" className="w-full max-w-xs mx-auto rounded-lg border shadow" />
            {modelImageUrl && (
                <div className="flex flex-col items-center gap-2 mt-4">
                    <button
                        onClick={applyModelImageToUploadBox}
                        className="bg-pink-400 text-white px-4 py-2 rounded-md hover:bg-pink-500 transition w-full"
                    >
                        📌 이미지 적용
                    </button>
                    <button
                        onClick={handleNextStep}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition w-full"
                    >
                        다음 단계로 &rarr;
                    </button>
                </div>
            )}
          </div>
        )}
        {currentStep >= 2 && currentStep < 6 && (
          <div>
            <img src={fittedImageUrl || "/placeholder.svg"} alt="피팅 미리보기" className="w-full max-w-xs mx-auto rounded-lg border shadow" />
            {fittedImageUrl && (
                <div className="flex flex-col items-center gap-2 mt-4">
                    <button
                        onClick={handleNextStep}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition w-full"
                    >
                        다음 단계로 &rarr;
                    </button>
                </div>
            )}
          </div>
        )}
        {currentStep >= 6 && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-2">{title || "제목"}</h4>
            <p className="text-sm text-gray-600 mb-2">{shortDesc || "간단 설명"}</p>
            <img src={safeImages.fittedImageUrl || fittedImageUrl || "/placeholder.svg"} alt="템플릿 미리보기" className="w-full h-48 object-cover rounded-md" />
          </div>
        )}
      </div>
    </div>
  );
}
