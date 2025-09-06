//index.js
// 환경변수 로딩
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http'; // ✅ Socket.io 사용을 위해 http 모듈 추가
import { runLiveStreamingServer } from './routes/liveStreamingServer.js';
import streamControl from './routes/streamControl.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ 라우터 연결 AI라이브 커머스
import aiLiveCommerceRoutes from './routes/aiLiveCommerce.js'; //✅ ai라이브커머스page
import initAiLiveCommerceSocket from './routes/aiLiveCommerceSocket.js';  //✅ ai라이브커머스Socket
import liveCommerceChatRouter from "./routes/liveCommerceChat.js"; 

// ✅ 라우터 연결 제품이미지 업로드(상세페이지제작)
import generateTextFromUrls from './routes/generate-text-from-urls.js'; //✅ STEP 7
import runwayFittingCutRouter from './routes/runwayFittingCut.js'; //✅ STEP 3 
import runwayFittingRoute from './routes/runwayFitting.js'; //✅ STEP 2
import runwayImageToVideoRouter from './routes/runwayImageToVideo.js'; //✅ STEP 4
import generateTextFromImage from './routes/generateTextFromImage.js'; // 필요 시 유지
import leonardoRoute from './routes/leonardoAPI.js'; // 필요 시 유지
import fashnFittingRoute from './routes/fashnFitting.js'; // 필요 시 유지
import chatbotRoute from './routes/chatbot.js';
import chatLogsRoute from './routes/chatLogs.js'; // 선택사항
import chatStatusRoute from './routes/chatStatus.js';
import generateAdviceRoute from './routes/generateAdvice.js';
import adminRoutes from './routes/adminRoutes.js';
import cafe24Routes from './routes/cafe24.js';
import productsRoutes from './routes/products.js';
import sendToDemo from './routes/sendToDemo.js';
import chatRequestRouter from './routes/chatRequest.js';
import dalle3Router from './routes/dalle3.js';

// ✅ 사용 라우터 등록

//✅ ai라이브커머스page
app.use('/api/live-commerce', aiLiveCommerceRoutes);   // 세션, 스크립트
app.use("/api/live-commerce", liveCommerceChatRouter);  // 채팅
app.use('/api/stream', streamControl); // 송출 제어 API

app.use('/generate-text-from-urls', generateTextFromUrls);  // ✅ STEP 7
app.use('/runway-fitting-cut', runwayFittingCutRouter);  // ✅ STEP 3
app.use('/runway-fitting', runwayFittingRoute); // ✅ STEP 2
app.use('/runway-image-to-video', runwayImageToVideoRouter);
app.use('/leonardo', leonardoRoute);
app.use('/generate-text', generateTextFromImage);
app.use('/fashn-fitting', fashnFittingRoute);
app.use('/chatbot', chatbotRoute);
app.use('/chat-logs', chatLogsRoute); // 선택 사항
app.use('/chat-status', chatStatusRoute);
app.use('/generate-advice', generateAdviceRoute);
app.use('/api/admin', adminRoutes); // ✅ /api/admin/approval 등 하위 경로 포함됨
app.use('/api/cafe24', cafe24Routes);
app.use('/api/products', productsRoutes);
app.use('/api/send-to-demo', sendToDemo);
app.use('/api/chat-request', chatRequestRouter);
app.use('/dalle3', dalle3Router);   

// 기본 라우터
app.get('/', (req, res) => {
  res.send('✅ 서버 작동 중입니다.');
});

// ✅ HTTP 서버 생성 (Socket.io용)
const server = http.createServer(app);

// ✅ 소켓 초기화
initAiLiveCommerceSocket(server);

// RTMP 브리지 서버 실행
runLiveStreamingServer();

// 서버 시작
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
