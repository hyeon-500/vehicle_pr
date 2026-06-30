// server/app.js 내부 필수 조립 라인 예시
const express = require('express');
const net = require('net');
const apiRouter = require('./routes/api');
const { parseIncomingWirelessPacket } = require('./gateway/json_parser');

const app = express();

// 라우터 등록 처리
app.use('/api', apiRouter); // http://IP:3000/api/ecu3 구조로 연결 완료!

// TCP 소켓으로 ESP32 데이터 수신 시 파서 연동
const socketServer = net.createServer((socket) => {
    socket.on('data', (buffer) => {
        parseIncomingWirelessPacket(buffer); // 게이트웨이 파서로 휙 던지기
    });
});