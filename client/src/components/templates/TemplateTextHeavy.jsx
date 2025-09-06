// src/components/templates/TemplateTextHeavy.jsx
export default function TemplateTextHeavy({
  modelImageUrl, fittedImageUrl, multiFittedImages, detailImages, generatedVideoUrl,
  title, shortDesc, imgDescs, longDesc
}) {
  return (
    <div className="bg-white p-6 rounded-lg space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <p className="text-lg text-gray-600">{shortDesc}</p>

      {modelImageUrl && (
        <img src={modelImageUrl} alt="모델" className="rounded shadow-md w-full" />
      )}

      {fittedImageUrl && (
        <img src={fittedImageUrl} alt="피팅" className="rounded shadow-md w-full" />
      )}

      {multiFittedImages?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {multiFittedImages.map((url, i) => (
            <img key={i} src={url} alt={`포즈 ${i}`} className="rounded shadow" />
          ))}
        </div>
      )}

      {detailImages?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {detailImages.map((img, i) =>
            img ? (
              <div key={i}>
                <img src={img} className="rounded shadow" />
                <p className="text-sm text-gray-500 text-center mt-1">{imgDescs?.[i]}</p>
              </div>
            ) : null
          )}
        </div>
      )}

      {generatedVideoUrl && (
        <video src={generatedVideoUrl} controls className="w-full rounded shadow" />
      )}

      <article className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {longDesc}
      </article>
    </div>
  );
}
