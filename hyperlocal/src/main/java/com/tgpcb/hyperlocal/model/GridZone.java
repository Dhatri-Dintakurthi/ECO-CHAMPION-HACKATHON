package com.tgpcb.hyperlocal.model;

public record GridZone(
                String id,
                String name,
                double latitude,
                double longitude,
                double pm25Value,
                String category,
                double trafficIndex,
                double weatherInfluence,
                double windSpeed,
                double temperature) {
}
