import React, { useEffect } from 'react';

const imageLabels = ['front', 'side', 'back', 'point'];

export default function Step5DetailUpload({ 
  detailImages, 
  handleDetailImageUpload, 
  uploadingIndex, 
  uploadedList, 
  fetchUploadedImages, 
  userId, 
  handleNextStep
}) {

  useEffect(() => {
    if (userId) {
      fetchUploadedImages();
    }
  }, [userId, fetchUploadedImages]);

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg space-y-6 border border-yellow-300">
      <h2 className="text-2xl font-bold text-yellow-600 text-center">
        STEP 5. 상품 디테일 이미지 추가
      </h2>
      <p className="text-center text-gray-600">
        정면, 측면, 후면, 포인트컷 등 총 4장의 실제 상품 디테일 이미지를 등록하세요.
      </p>

      {/* 업로드 입력 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {imageLabels.map((label, index) => (
          <div key={index} className="text-center space-y-2">
            <label className="font-medium text-gray-700">{label}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleDetailImageUpload(e.target.files[0], index)}
              className="block w-full border border-gray-300 rounded-md px-3 py-2"
              disabled={uploadingIndex !== null}
            />
            {uploadingIndex === index && (
              <p className="text-sm text-yellow-500">업로드 중...</p>
            )}
            {detailImages[index] && (
              <img
                src={detailImages[index]}
                alt={`${label} 미리보기`}
                className="w-full max-w-xs mx-auto rounded-lg shadow"
              />
            )}
          </div>
        ))}
      </div>

      {/* 업로드된 이미지 목록 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mt-6">
          📂 업로드된 이미지 (최신순)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {uploadedList.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`업로드 이미지 ${i}`}
              className="w-full rounded-lg shadow"
            />
          ))}
        </div>
      </div>

      {detailImages.some(img => img) && (
        <div className="text-center mt-6">
            <button
                onClick={handleNextStep}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
            >
                다음 단계로 &rarr;
            </button>
        </div>
      )}
    </section>
  );
}
