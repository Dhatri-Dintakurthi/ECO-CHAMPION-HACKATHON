package com.tgpcb.hyperlocal.controller;

import com.tgpcb.hyperlocal.model.Alert;
import com.tgpcb.hyperlocal.model.GridZone;
import com.tgpcb.hyperlocal.service.PollutionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") // Allow frontend to fetch
public class AQIController {

    private final PollutionService pollutionService;

    public AQIController(PollutionService pollutionService) {
        this.pollutionService = pollutionService;
    }

    @GetMapping("/pm25-data")
    public List<GridZone> getPm25Data() {
        return pollutionService.getAllGrids();
    }

    @GetMapping("/hotspots")
    public List<GridZone> getHotspots() {
        return pollutionService.getHotspots();
    }

    @GetMapping("/alerts")
    public List<Alert> getAlerts() {
        return pollutionService.getActiveAlerts();
    }

    @GetMapping(value = "/alerts/export", produces = "text/csv")
    public org.springframework.http.ResponseEntity<String> exportAlertsCsv() {
        String filename = "PM25_Alert_Report_Hyderabad_" + java.time.LocalDate.now() + ".csv";
        StringBuilder csv = new StringBuilder();
        csv.append("Date & Time,Grid / Location,PM2.5 value (mcg/m3),Severity level\n");
        for (Alert alert : pollutionService.getActiveAlerts()) {
            csv.append(alert.timestamp()).append(",")
                    .append(alert.gridName()).append(",")
                    .append(alert.pm25Value()).append(",")
                    .append(alert.severity()).append("\n");
        }
        return org.springframework.http.ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .body(csv.toString());
    }
}
