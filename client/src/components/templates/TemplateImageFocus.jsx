// src/components/templates/TemplateImageFocus.jsx
export default function TemplateImageFocus({
  modelImageUrl, fittedImageUrl, multiFittedImages, detailImages, generatedVideoUrl
}) {
  return (
    <div className="bg-white p-6 rounded-xl space-y-6">
      {modelImageUrl && <img src={modelImageUrl} className="w-full rounded shadow" alt="모델 이미지" />}

      {fittedImageUrl && <img src={fittedImageUrl} className="w-full rounded shadow" alt="피팅 이미지" />}

      {multiFittedImages?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {multiFittedImages.map((url, i) => (
            <img key={i} src={url} className="rounded shadow" alt={`포즈 ${i}`} />
          ))}
        </div>
      )}

      {detailImages?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {detailImages.map((img, i) => (
            <img key={i} src={img} className="rounded shadow" alt={`디테일 ${i}`} />
          ))}
        </div>
      )}

      {generatedVideoUrl && (
        <video src={generatedVideoUrl} controls className="w-full rounded shadow" />
      )}
    </div>
  );
}
