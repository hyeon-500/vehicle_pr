const riskService = require('../services/risk_service');

/**
 * ESP32 무선 LAN 소켓으로부터 유입된 바이너리 버퍼 스트림 해석
 * 규격: StdId (2바이트) + DLC (1바이트) + Data (8바이트) = 총 11바이트 패킷
 */
function parseIncomingWirelessPacket(buffer) {
    if (!buffer || buffer.length < 11) return;

    try {
        const stdId = buffer.readUInt16BE(0);
        const dlc = buffer.readUInt8(2);
        const dataBytes = buffer.slice(3, 3 + dlc);

        // ID 권역별로 해당하는 서비스 레이어로 토스
        if (stdId === 0x300 || stdId === 0x703) {
            riskService.updateECU3State(stdId, dataBytes);
        } else if (stdId === 0x100 || stdId === 0x200) {
            riskService.updateExternalSensor(stdId, dataBytes);
        }
    } catch (error) {
        console.error('[Parser Error] TCP Stream Corruption:', error.message);
    }
}

module.exports = {
    parseIncomingWirelessPacket
};