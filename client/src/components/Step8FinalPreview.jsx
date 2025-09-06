import React from 'react';
import TemplateModern from './templates/TemplateModern';
import TemplateBasic from './templates/TemplateBasic';
import TemplateImageFocus from './templates/TemplateImageFocus';
import TemplateTextHeavy from './templates/TemplateTextHeavy';

const templateMap = {
  modern: TemplateModern,
  basic: TemplateBasic,
  image: TemplateImageFocus,
  text: TemplateTextHeavy,
};

export default function Step8FinalPreview({
  selectedTemplate,
  safeImages,
  generatedVideoUrl,
  title,
  setTitle,
  shortDesc,
  setShortDesc,
  imgDescs,
  setImgDescs,
  longDesc,
  setLongDesc,
}) {
  const Template = templateMap[selectedTemplate];
  const editable = true;

  if (!Template) {
    return (
      <section className="bg-white p-6 rounded-xl shadow mt-10 border text-center">
        <h2 className="text-xl text-red-500 font-semibold">선택된 템플릿이 없습니다.</h2>
        <p className="text-gray-500 mt-2">STEP 6에서 템플릿을 먼저 선택해주세요.</p>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow mt-10 border">
      <h2 className="text-2xl font-bold text-pink-500 text-center mb-6">
        STEP 8. 최종 상세페이지 미리보기 & 수정
        <span className="block text-sm text-gray-500 mt-1">
          선택된 템플릿: <strong>{selectedTemplate}</strong>
        </span>
      </h2>

      <Template
        modelImageUrl={safeImages.modelImageUrl}
        fittedImageUrl={safeImages.fittedImageUrl}
        multiFittedImages={safeImages.multiFittedImages}
        detailImages={safeImages.detailImages}
        generatedVideoUrl={generatedVideoUrl}
        title={title}
        setTitle={setTitle}
        shortDesc={shortDesc}
        setShortDesc={setShortDesc}
        imgDescs={imgDescs}
        setImgDescs={setImgDescs}
        longDesc={longDesc}
        setLongDesc={setLongDesc}
        editable={editable}
        crossOrigin="anonymous"
      />
    </section>
  );
}