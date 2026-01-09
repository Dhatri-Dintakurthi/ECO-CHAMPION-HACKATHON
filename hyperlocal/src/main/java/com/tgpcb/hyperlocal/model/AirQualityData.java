package com.tgpcb.hyperlocal.model;

public record AirQualityData(
        String stationName,
        double latitude,
        double longitude,
        double pm25) {
}
