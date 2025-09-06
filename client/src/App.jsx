import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import DetailMaker from './pages/DetailMaker';
import ChatLogs from './pages/ChatLogs';
import LedgerPage from './pages/LedgerPage';
import Settings from './pages/Settings';
import MyProducts from './pages/MyProducts';  // ✅ 내가 작성한 상세페이지 목록 페이지
import AuthForm from './components/AuthForm'; // ✅ 로그인 컴포넌트!
import ProductUpload from './pages/ProductUpload';

// ✅ ai라이브 커머스
import AiLiveCommerce from './pages/AiLiveCommerce';
import AiLiveCreateRoom from './pages/AiLiveCreateRoom';
import AiLiveRoom from './pages/AiLiveRoom';


// ✅ 기능 카테고리의 페이지들
import AdVideoMaker from './pages/features/AdVideoMaker';
import ImageSynthesis from './pages/features/ImageSynthesis';
import ModelGeneration from './pages/features/ModelGeneration';
import TemplateTool from './pages/features/TemplateTool';
import TextWriter from './pages/features/TextWriter';
import UploaderPage from './pages/features/UploaderPage';
import VideoMaker from './pages/features/VideoMaker';
import ChatGuide from './pages/features/ChatGuide';
import LedgerGuide from './pages/features/LedgerGuide';

// ✅ 비즈니스 카테고리의 페이지들
import BulkDetailPage from './pages/business/BulkDetailPage';
import GlobalSyncPage from './pages/business/GlobalSyncPage';
import DomesticSyncPage from './pages/business/DomesticSyncPage';
import SelfHostedSyncPage from './pages/business/SelfHostedSyncPage';

// ✅ DOC 와 API 카테고리의 페이지들
import GuideDocPage from './pages/docs/GuideDocPage';
import ApiListPage from './pages/docs/ApiListPage';

// ✅ FAQ 와 가격 카테고리의 페이지들
import FaqPage from './pages/docs/FaqPage';
import PricePage from './pages/docs/PricePage';

// ✅ 관리자용
import AdminDashboard from './pages/admin/AdminDashboard';
import PageApproval from './pages/admin/PageApproval';
import ChatAnalysis from './pages/admin/ChatAnalysis';
import SalesReport from './pages/admin/SalesReport';
import UserManagement from './pages/admin/UserManagement';
import PageManagement from './pages/admin/PageManagement';
import TemplateUpload from './pages/admin/TemplateUpload';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* 사용자 라우팅 */}
        <Route path="/" element={<Home />} />

        {/* ✅ 업로드 */}
        <Route path="/detail-maker" element={<DetailMaker />} />
        <Route path="/product-upload" element={<ProductUpload />} /> 
        <Route path="/ai-live-commerce" element={<AiLiveCommerce />} />
        <Route path="/ai-live-commerce/create-room" element={<AiLiveCreateRoom />} />
        <Route path="/ai-live-commerce/live/:roomName" element={<AiLiveRoom />} />

        {/* ✅ 기능 */}
        <Route path="/features/ad-video-maker" element={<AdVideoMaker />} />
        <Route path="/features/image-synthesis" element={<ImageSynthesis />} />
        <Route path="/features/model-generation" element={<ModelGeneration />} />
        <Route path="/features/template-tool" element={<TemplateTool />} />
        <Route path="/features/text-writer" element={<TextWriter />} />
        <Route path="/features/uploader" element={<UploaderPage />} />
        <Route path="/features/video-maker" element={<VideoMaker />} />
        <Route path="/features/chat-guide" element={<ChatGuide />} />
        <Route path="/features/ledger-guide" element={<LedgerGuide />} />

        {/* ✅ 비즈니스용 */}
        <Route path="/business/bulk-detail" element={<BulkDetailPage />} />
        <Route path="/business/global-sync" element={<GlobalSyncPage />} />
        <Route path="/business/domestic-sync" element={<DomesticSyncPage />} />
        <Route path="/business/self-hosted-sync" element={<SelfHostedSyncPage />} />

        {/* ✅ DOC 와 API */}
        <Route path="/docs/guide" element={<GuideDocPage />} />
        <Route path="/docs/api-list" element={<ApiListPage />} />

        {/* ✅ FAQ 와 가격 */}
        <Route path="/docs/faq" element={<FaqPage />} />
        <Route path="/docs/price" element={<PricePage />} />

        {/* ✅ 나의 상세페이지 목록 */}
        <Route path="/my-products" element={<MyProducts />} />  
        <Route path="/chat-logs" element={<ChatLogs />} />
        <Route path="/ledger" element={<LedgerPage />} />
        <Route path="/settings" element={<Settings />} />

        {/* ✅ 로그인/로그아웃 */}
        <Route path="/login" element={<AuthForm />} /> 

        {/* 관리자 라우팅 */}
        <Route path="/admin/approvals" element={<PageApproval />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/chat-analysis" element={<ChatAnalysis />} />
        <Route path="/admin/sales-report" element={<SalesReport />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="/admin/page-management" element={<PageManagement />} />
        <Route path="/admin/template-upload" element={<TemplateUpload />} />
      </Routes>
    </BrowserRouter>
  );
}
