// 차량 전체 통합 상태 데이터 모델 (메모리 보관)
const vehicleState = {
    riskLevel: 0,
    brakeLevel: 0,
    wiperState: 0,
    ledState: 0,
    humidity: 0,
    lux: 0,
    ecu3_alive: false,
    last_heartbeat: null
};

/**
 * Gateway 모듈에서 파싱 완료된 CAN 데이터를 주입받아 실시간 상태 갱신
 */
function updateECU3State(stdId, dataBytes) {
    const now = new Date();
    vehicleState.last_heartbeat = now;
    vehicleState.ecu3_alive = true;

    if (stdId === 0x300) { // ECU3 제어 상태
        vehicleState.riskLevel  = dataBytes[0];
        vehicleState.brakeLevel = dataBytes[1];
        vehicleState.wiperState = dataBytes[2];
        vehicleState.ledState   = dataBytes[3];
        console.log(`[Service] ECU3 State Synchronized. Risk: ${vehicleState.riskLevel}`);
    } 
    else if (stdId === 0x703) { // ECU3 Heartbeat
        // 하트비트 시 타임스탬프만 최신화 (생존 신고)
    }
}

// 환경 데이터(ECU1)나 주행 데이터(ECU2) 수신 시 서비스 계층 백업 함수 확장용
function updateExternalSensor(stdId, dataBytes) {
    if (stdId === 0x100) {
        vehicleState.humidity = dataBytes[1];
        vehicleState.lux = (dataBytes[2] << 8) | dataBytes[3];
    }
}

// 🕒 ECU3 하트비트 유실 감지 타이머 (3초 주기 감시)
setInterval(() => {
    if (vehicleState.last_heartbeat) {
        const diff = Date.now() - vehicleState.last_heartbeat.getTime();
        if (diff > 3000) { // 3초 초과 시
            vehicleState.ecu3_alive = false;
            console.warn(`[🚨 ALERT] ECU3 CAN Node Communication Timeout!`);
        }
    }
}, 2000);

module.exports = {
    getVehicleState: () => vehicleState,
    updateECU3State,
    updateExternalSensor
};