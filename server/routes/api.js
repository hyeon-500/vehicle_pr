const express = require('express');
const router = express.Router();
const riskService = require('../services/risk_service');

/**
 * @route   GET /server/routes/api/ecu3
 * @desc    대시보드 UI에 ECU3 현재 안전 제어 및 주행 환경 상태 전달
 */
router.get('/ecu3', (req, res) => {
    // riskService가 정비해 둔 최신 데이터를 꺼내서 응답
    const currentVehicleState = riskService.getVehicleState();
    
    res.json({
        status: "success",
        timestamp: new Date(),
        ecu3_node: {
            is_alive: currentVehicleState.ecu3_alive,
            risk_level: currentVehicleState.riskLevel,
            brake_level: currentVehicleState.brakeLevel,
            wiper_state: currentVehicleState.wiperState,
            led_state: currentVehicleState.ledState
        },
        environment: {
            humidity: currentVehicleState.humidity,
            lux: currentVehicleState.lux
        }
    });
});

module.exports = router;