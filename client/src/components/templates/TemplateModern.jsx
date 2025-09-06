// src/components/templates/TemplateModern.jsx

export default function TemplateModern({
  modelImageUrl,
  fittedImageUrl,
  multiFittedImages = [],
  detailImages = [],
  generatedVideoUrl,
  title,
  setTitle,
  shortDesc,
  setShortDesc,
  imgDescs,
  setImgDescs,
  longDesc,
  setLongDesc,
  editable = false,
}) {
  // ✅ 이미지 설명 업데이트 함수
  const updateImgDesc = (index, value) => {
    const newDescs = [...imgDescs];
    newDescs[index] = value;
    setImgDescs?.(newDescs);
  };

  let imgIndex = 0; // 이미지 설명 순서를 추적하기 위한 인덱스

  return (
    <div className="p-6 bg-gray-50 rounded-xl space-y-8 text-gray-800">
      {/* 제목 및 요약 */}
      <div className="text-center space-y-2">
        {editable ? (
          <>
            <input
              value={title}
              onChange={(e) => setTitle?.(e.target.value)}
              className="text-3xl font-bold w-full text-center border-b border-gray-300"
            />
            <input
              value={shortDesc}
              onChange={(e) => setShortDesc?.(e.target.value)}
              className="text-lg text-gray-600 w-full text-center border-b border-gray-200"
            />
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-lg text-gray-600">{shortDesc}</p>
          </>
        )}
      </div>

      {/* STEP 1: AI 모델 이미지 */}
      {modelImageUrl && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">👤 AI 모델 이미지</h3>
          <img src={modelImageUrl} alt="모델 이미지" className="w-full rounded-lg shadow-md" />
          {editable && (
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="이 이미지에 대한 설명을 입력하세요"
              value={imgDescs[imgIndex] || ''}
              onChange={(e) => updateImgDesc(imgIndex, e.target.value)}
              rows={2}
            />
          )}
          {imgIndex++}
        </div>
      )}

      {/* STEP 2: 합성 피팅 이미지 */}
      {fittedImageUrl && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 mt-6">🧥 착용 이미지</h3>
          <img src={fittedImageUrl} alt="피팅 이미지" className="w-full rounded-lg shadow-md" />
          {editable && (
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="이 이미지에 대한 설명을 입력하세요"
              value={imgDescs[imgIndex] || ''}
              onChange={(e) => updateImgDesc(imgIndex, e.target.value)}
              rows={2}
            />
          )}
          {imgIndex++}
        </div>
      )}

      {/* STEP 3: 다양한 포즈 이미지 */}
      {multiFittedImages.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mt-6">📸 다양한 모델 포즈</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {multiFittedImages.map((url, i) => (
              <div key={i}>
                <img src={url} alt={`포즈 ${i + 1}`} className="w-full rounded shadow-md" />
                {editable && (
                  <textarea
                    className="w-full border rounded px-3 py-2 text-sm mt-1"
                    placeholder={`포즈 ${i + 1}에 대한 설명`}
                    value={imgDescs[imgIndex] || ''}
                    onChange={(e) => updateImgDesc(imgIndex, e.target.value)}
                    rows={2}
                  />
                )}
                {imgIndex++}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: 디테일 이미지 */}
      {detailImages.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mt-6">🔍 디테일 컷</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {detailImages.map((img, i) =>
              img ? (
                <div key={i}>
                  <img src={img} alt={`디테일 ${i + 1}`} className="w-full rounded shadow-md" />
                  {editable && (
                    <textarea
                      className="w-full border rounded px-3 py-2 text-sm mt-1"
                      placeholder={`디테일 ${i + 1} 설명`}
                      value={imgDescs[imgIndex] || ''}
                      onChange={(e) => updateImgDesc(imgIndex, e.target.value)}
                      rows={2}
                    />
                  )}
                  {imgIndex++}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* STEP 4: 영상 */}
      {generatedVideoUrl && (
        <div className="space-y-2 mt-6">
          <h3 className="font-semibold text-gray-700">🎥 제품 소개 영상</h3>
          <video src={generatedVideoUrl} controls className="w-full rounded shadow-md" />
          {editable && (
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="영상에 대한 설명을 입력하세요"
              value={imgDescs[imgIndex] || ''}
              onChange={(e) => updateImgDesc(imgIndex, e.target.value)}
              rows={2}
            />
          )}
          {imgIndex++}
        </div>
      )}

      {/* 상세 설명 */}
      <div className="mt-8 bg-white rounded-md p-4 shadow-sm border">
        <h3 className="font-semibold text-gray-700 mb-2">📄 상세 설명</h3>
        {editable ? (
          <textarea
            value={longDesc}
            onChange={(e) => setLongDesc?.(e.target.value)}
            className="w-full h-40 border rounded px-3 py-2 text-gray-700"
          />
        ) : (
          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{longDesc}</p>
        )}
      </div>
    </div>
  );
}
