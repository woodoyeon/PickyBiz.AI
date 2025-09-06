import React from 'react';

export default function Step7TextGenerator({
  generateText,
  isLoading,
  title,
  setTitle,
  shortDesc,
  setShortDesc,
  imgDescs,
  setImgDescs,
  longDesc,
  setLongDesc,
  productName,
  setProductName,
  emphasisKeywords,
  setEmphasisKeywords,
  handleNextStep
}) {

  const handleGenerateClick = () => {
    if (!productName.trim()) {
      alert("상품명은 필수 입력 항목입니다.");
      return;
    }
    generateText();
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow mt-10 border">
      <h2 className="text-2xl font-bold text-pink-500 text-center mb-4">STEP 7. 이미지 기반 글 작성 및 수정</h2>

      <div className="space-y-4">
        <div>
          <label className="font-semibold">상품명 (필수)</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
            placeholder="예: 프리미엄 코튼 셔츠"
          />
        </div>

        <div>
          <label className="font-semibold">강조하고 싶은 키워드 (선택)</label>
          <input
            type="text"
            value={emphasisKeywords}
            onChange={(e) => setEmphasisKeywords(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
            placeholder="예: 편안한 착용감, 트렌디한 디자인, 데일리룩"
          />
        </div>
      </div>

      <div className="flex justify-end my-4">
        <button
          onClick={handleGenerateClick}
          className="bg-pink-500 text-white px-4 py-2 rounded shadow hover:bg-pink-600"
          disabled={isLoading}
        >
          {isLoading ? "생성 중..." : "✍️ GPT로 자동 생성"}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-semibold">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="font-semibold">간단한 설명</label>
          <input
            type="text"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="font-semibold">각 이미지에 대한 설명</label>
          {imgDescs?.map((desc, i) => (
            <input
              key={i}
              type="text"
              value={desc}
              onChange={(e) => {
                const newDescs = [...imgDescs];
                newDescs[i] = e.target.value;
                setImgDescs(newDescs);
              }}
              placeholder={`이미지 ${i + 1} 설명`}
              className="w-full mt-1 border rounded px-3 py-2 mb-2"
            />
          ))}
        </div>

        <div>
          <label className="font-semibold">상세 설명</label>
          <textarea
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2 h-40"
          />
        </div>
      </div>

      {title && (
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