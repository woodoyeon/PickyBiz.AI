// src/components/templates/TemplateBasic.jsx
export default function TemplateBasic({
  modelImageUrl, fittedImageUrl, multiFittedImages, detailImages, generatedVideoUrl,
  title, shortDesc, imgDescs, longDesc
}) {
  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      {/* 제목 */}
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600">{shortDesc}</p>

      {/* STEP 1: 모델 이미지 */}
      {modelImageUrl && (
        <div>
          <h3 className="font-semibold text-gray-700 mt-2">모델 이미지</h3>
          <img src={modelImageUrl} alt="모델 이미지" className="w-full rounded shadow" />
        </div>
      )}

      {/* STEP 2: 피팅 이미지 */}
      {fittedImageUrl && (
        <div>
          <h3 className="font-semibold text-gray-700 mt-4">착용 이미지</h3>
          <img src={fittedImageUrl} alt="피팅 이미지" className="w-full rounded shadow" />
        </div>
      )}

      {/* STEP 3: 다양한 포즈 */}
      {multiFittedImages?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mt-4">다양한 포즈</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {multiFittedImages.map((url, i) => (
              <img key={i} src={url} alt={`포즈 ${i + 1}`} className="rounded shadow" />
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: 디테일 이미지 */}
      {detailImages?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mt-4">디테일 이미지</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {detailImages.map((img, i) =>
              img ? (
                <div key={i}>
                  <img src={img} alt={`디테일 ${i + 1}`} className="rounded shadow" />
                  <p className="text-sm text-gray-500 text-center mt-1">{imgDescs?.[i]}</p>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* STEP 4: 영상 */}
      {generatedVideoUrl && (
        <div>
          <h3 className="font-semibold text-gray-700 mt-4">제품 소개 영상</h3>
          <video src={generatedVideoUrl} controls className="w-full rounded shadow" />
        </div>
      )}

      {/* 설명 */}
      <div className="text-gray-700 whitespace-pre-wrap mt-6">{longDesc}</div>
    </div>
  );
}
