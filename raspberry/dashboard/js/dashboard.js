/**
 * dashboard.js
 * UDS Vehicle Monitoring Dashboard
 */

/* ===============================
    Vehicle Dashboard
=============================== */

function updateVehicleDashboard(vehicleState) {

    /* Vehicle Status */
    document.getElementById("vehicleStatus").textContent =
        vehicleState.ecu3.status;

    /* Vehicle Control */
    document.getElementById("risk").textContent =
        convertRiskLevel(vehicleState.ecu3.riskLevel);

    document.getElementById("brake").textContent =
        vehicleState.ecu3.brakeLevel ? "ON" : "OFF";

    document.getElementById("wiper").textContent =
        vehicleState.ecu3.wiperState ? "ON" : "OFF";

    document.getElementById("led").textContent =
        vehicleState.ecu3.ledState ? "ON" : "OFF";

    /* Environment */

    document.getElementById("temperature").textContent =
        `${vehicleState.ecu1.temperature} ℃`;

    document.getElementById("humidity").textContent =
        `${vehicleState.ecu1.humidity} %`;

    document.getElementById("lux").textContent =
        `${vehicleState.ecu1.lux} lux`;

    /* Driving */

    document.getElementById("speed").textContent =
        `${vehicleState.ecu2.speed} km/h`;

    document.getElementById("distance").textContent =
        `${vehicleState.ecu2.distance} cm`;

}

/* ===============================
    UDS Dashboard
=============================== */

async function updateUDSDashboard() {

    try {

        const response = await fetch("/api/dtc");

        const rows = await response.json();

        const table = document.getElementById("dtcTable");

        table.innerHTML = "";

        if (rows.length === 0) {

            document.getElementById("dtcSummary").textContent =
                "No DTC";

            table.innerHTML = `

                <tr>

                    <td colspan="3">

                        No DTC

                    </td>

                </tr>

            `;

            return;

        }

        document.getElementById("dtcSummary").textContent =
            `${rows.length} Active DTC`;

        rows.forEach(item => {

            table.innerHTML += `

                <tr>

                    <td>${item.dtc_code}</td>

                    <td>${item.description}</td>

                    <td>${item.status}</td>

                </tr>

            `;

        });

    }
    catch (err) {

        console.error("[DTC ERROR]", err);

    }

}

/* ===============================
    Heartbeat Dashboard
=============================== */

async function updateHeartbeatDashboard() {

    try {

        const response =
            await fetch("/api/heartbeat");

        const rows =
            await response.json();

        const table =
            document.getElementById("heartbeatTable");

        table.innerHTML = "";

        rows.forEach(item => {

            table.innerHTML += `

                <tr>

                    <td>ECU${item.ecu_id}</td>

                    <td>${item.status}</td>

                    <td>${item.last_received}</td>

                </tr>

            `;

        });

    }
    catch (err) {

        console.error("[Heartbeat ERROR]", err);

    }

}

/* ===============================
    Risk Level
=============================== */

function convertRiskLevel(level) {

    switch (level) {

        case 0:
            return "SAFE";

        case 1:
            return "CAUTION";

        case 2:
            return "WARNING";

        case 3:
            return "DANGER";

        default:
            return level;

    }

}

/* ===============================
    WebSocket Callback
=============================== */

function onVehicleStateReceived(vehicleState) {

    updateVehicleDashboard(vehicleState);

}

/* ===============================
    Initial Load
=============================== */

updateUDSDashboard();

updateHeartbeatDashboard();

/* ===============================
    Refresh
=============================== */

setInterval(() => {

    updateUDSDashboard();

    updateHeartbeatDashboard();

}, 3000);