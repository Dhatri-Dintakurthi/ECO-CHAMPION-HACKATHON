package com.tgpcb.hyperlocal.service;

import com.tgpcb.hyperlocal.model.AirQualityData;
import com.tgpcb.hyperlocal.model.Alert;
import com.tgpcb.hyperlocal.model.GridZone;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
public class PollutionService {

    private final List<GridZone> gridZones = new CopyOnWriteArrayList<>();
    private final List<Alert> activeAlerts = new CopyOnWriteArrayList<>();
    private final List<AirQualityData> stations = new ArrayList<>();
    private final Map<String, Integer> persistenceCounters = new HashMap<>();

    public PollutionService() {
        initializeStations();
        initializeGrids();
        updatePollutionLevels();
    }

    private void initializeStations() {
        // Scatter stations DIRECTLY inside the grid bounds for guaranteed variety
        // Grid is 17.300 to 17.350 Lat, 78.400 to 78.450 Lon
        stations.add(new AirQualityData("Park Area (Green)", 17.310, 78.410, 15.0)); // GOOD
        stations.add(new AirQualityData("Residential Zone", 17.325, 78.425, 40.0)); // MODERATE
        stations.add(new AirQualityData("Industrial Cluster", 17.345, 78.445, 85.0)); // HIGH
        stations.add(new AirQualityData("Commercial Hub", 17.305, 78.440, 55.0)); // MODERATE
        stations.add(new AirQualityData("Forest Edge", 17.340, 78.405, 12.0)); // GOOD
        stations.add(new AirQualityData("Traffic Junction", 17.320, 78.448, 70.0)); // HIGH
    }

    private void initializeGrids() {
        // Divide Hyderabad into a 10x10 grid for demonstration (can be more granular)
        // Center: 17.385, 78.486
        double startLat = 17.300;
        double startLon = 78.400;
        double step = 0.005; // ~500m

        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                String id = "G-" + i + "-" + j;
                String name = regions[(i + j) % regions.length] + " Grid " + (i * 10 + j);
                gridZones
                        .add(new GridZone(id, name, startLat + i * step, startLon + j * step, 0.0, "Unknown", 50.0, 0.0,
                                10.0, 30.0));
                persistenceCounters.put(id, 0);
            }
        }
    }

    public void updatePollutionLevels() {
        Random random = new Random();
        double basePm25 = calculateDiurnalBaseline();
        double[][] rawPmValues = new double[10][10];
        double[][] windSpeeds = new double[10][10];
        double[][] temperatures = new double[10][10];
        double[][] trafficIndices = new double[10][10];
        double[][] weatherInfluences = new double[10][10];

        // Define realistic pollution hotspots based on actual Hyderabad data
        // Grid coordinates: i=0 (south) to i=9 (north), j=0 (west) to j=9 (east)

        // Phase 1: Calculate raw PM2.5 for each zone with realistic spatial
        // distribution
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                // Base emission factor from region type
                String regionName = regions[(i + j) % regions.length];
                double baseEmission = getEmissionFactor(regionName);

                // Add spatial hotspot modifiers based on real Hyderabad pollution patterns
                double hotspotModifier = 0.0;

                // SANATHNAGAR HOTSPOT (Northwest) - Highest pollution due to industrial units
                // Real data: 67-120 µg/m³, often reaches 150-200 AQI
                if (i >= 6 && i <= 8 && j >= 1 && j <= 3) {
                    hotspotModifier = 25.0 + random.nextDouble() * 15; // +25 to +40
                }

                // JEEDIMETLA/BALANAGAR INDUSTRIAL AREA (North-Northwest)
                // Real data: Heavy industrial pollution, similar to Sanathnagar
                else if (i >= 7 && i <= 9 && j >= 0 && j <= 2) {
                    hotspotModifier = 20.0 + random.nextDouble() * 10; // +20 to +30
                }

                // PATANCHERU INDUSTRIAL CORRIDOR (Far Northwest)
                else if (i >= 8 && j == 0) {
                    hotspotModifier = 18.0 + random.nextDouble() * 12; // +18 to +30
                }

                // SECUNDERABAD/OLD CITY (Central-North) - High traffic, dense population
                // Real data: 64-70 µg/m³ average
                else if (i >= 5 && i <= 7 && j >= 4 && j <= 6) {
                    hotspotModifier = 10.0 + random.nextDouble() * 10; // +10 to +20
                }

                // MAJOR TRAFFIC JUNCTIONS (Scattered)
                // Nizampet, JNTU, Miyapur junctions - Real data: 150-336 µg/m³ at junctions
                else if ((i == 7 && j == 2) || (i == 6 && j == 1) || (i == 5 && j == 3)) {
                    hotspotModifier = 15.0 + random.nextDouble() * 15; // +15 to +30
                }

                // GACHIBOWLI (South-Southwest) - Mixed: IT hub but also some pollution
                // Real data: 65-87 µg/m³ (Unhealthy but not extreme)
                else if (i >= 1 && i <= 3 && j >= 0 && j <= 2) {
                    hotspotModifier = 5.0 + random.nextDouble() * 10; // +5 to +15
                }

                // JUBILEE HILLS/BANJARA HILLS (Central-South) - Cleaner upscale areas
                else if (i >= 3 && i <= 5 && j >= 5 && j <= 7) {
                    hotspotModifier = -10.0 + random.nextDouble() * 5; // -10 to -5
                }

                // HITECH CITY (Southwest) - IT area, moderate pollution
                else if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
                    hotspotModifier = 0.0 + random.nextDouble() * 8; // 0 to +8
                }

                // Wind effects - realistic wind patterns
                double windSpeed = 5 + random.nextDouble() * 20;
                double windReduction = Math.min(windSpeed * 0.6, 15); // Reduced wind effect

                // Calculate estimated PM2.5
                double estimatedPm = basePm25 + baseEmission + hotspotModifier - windReduction;

                // Add small random variation for realism
                estimatedPm += (random.nextDouble() - 0.5) * 8; // ±4 µg/m³ variation

                // Keep track of metadata
                rawPmValues[i][j] = estimatedPm;
                windSpeeds[i][j] = windSpeed;
                temperatures[i][j] = 25 + random.nextDouble() * 15;

                // Traffic index correlates with pollution
                if (hotspotModifier > 15) {
                    trafficIndices[i][j] = 60 + random.nextDouble() * 30; // High traffic
                } else if (hotspotModifier > 5) {
                    trafficIndices[i][j] = 40 + random.nextDouble() * 30; // Medium traffic
                } else {
                    trafficIndices[i][j] = 15 + random.nextDouble() * 30; // Low-medium traffic
                }

                weatherInfluences[i][j] = windReduction;
            }
        }

        // Phase 2: Spatial Smoothing (lighter smoothing to preserve hotspots)
        double[][] smoothedPmValues = new double[10][10];
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                double sum = 0;
                int count = 0;
                for (int di = -1; di <= 1; di++) {
                    for (int dj = -1; dj <= 1; dj++) {
                        if (di == 0 && dj == 0)
                            continue;
                        int ni = i + di;
                        int nj = j + dj;
                        if (ni >= 0 && ni < 10 && nj >= 0 && nj < 10) {
                            sum += rawPmValues[ni][nj];
                            count++;
                        }
                    }
                }
                double avgNeighbors = (count > 0) ? (sum / count) : rawPmValues[i][j];
                // Lighter smoothing: 70% original, 30% neighbors (instead of 50/50)
                smoothedPmValues[i][j] = (rawPmValues[i][j] * 0.7 + avgNeighbors * 0.3);

                // Safety Clamp: clamp(PM25, 15, 130)
                smoothedPmValues[i][j] = Math.max(15.0, Math.min(130.0, smoothedPmValues[i][j]));
            }
        }

        // Capture previous PM2.5 values for gradual change calculation
        Map<String, Double> previousPms = gridZones.stream()
                .collect(Collectors.toMap(GridZone::id, GridZone::pm25Value, (v1, v2) -> v1));

        List<GridZone> updatedGrids = new ArrayList<>();
        for (int i = 9; i >= 0; i--) { // Top to bottom for visual layout consistency
            for (int j = 0; j < 10; j++) {
                String id = "G-" + i + "-" + j;
                String regionName = regions[(i + j) % regions.length];
                String name = regionName + " Grid " + (i * 10 + j);
                double currentLat = 17.300 + i * 0.005;
                double currentLon = 78.400 + j * 0.005;

                double rawFinalPm = smoothedPmValues[i][j];

                // Apply Gradual Change Rule: Max allowed change per update is ±12 µg/m³
                if (previousPms.containsKey(id)) {
                    double prevPm = previousPms.get(id);
                    if (prevPm > 0.1) {
                        double delta = rawFinalPm - prevPm;
                        if (Math.abs(delta) > 12.0) {
                            rawFinalPm = prevPm + (Math.signum(delta) * 12.0);
                        }
                    }
                }

                // Final Safety Clamp
                double finalPm = Math.max(15.0, Math.min(130.0, rawFinalPm));
                String category = classifyAQI(finalPm);

                // Update persistence counter
                if (finalPm > 60) {
                    persistenceCounters.put(id, persistenceCounters.getOrDefault(id, 0) + 1);
                } else {
                    persistenceCounters.put(id, 0);
                }

                GridZone updatedGrid = new GridZone(
                        id, name, currentLat, currentLon,
                        Math.round(finalPm * 100.0) / 100.0, category,
                        Math.round(trafficIndices[i][j] * 10.0) / 10.0,
                        Math.round(weatherInfluences[i][j] * 10.0) / 10.0,
                        Math.round(windSpeeds[i][j] * 10.0) / 10.0,
                        Math.round(temperatures[i][j] * 10.0) / 10.0);
                updatedGrids.add(updatedGrid);

                // Alert Generation: PM2.5 > 60
                if (finalPm > 60) {
                    activeAlerts.add(0, new Alert(
                            id, name,
                            Math.round(finalPm * 100.0) / 100.0,
                            LocalDateTime.now(),
                            "HIGH_POLLUTION"));
                }
            }
        }

        // Keep only top 50 alerts
        while (activeAlerts.size() > 50) {
            activeAlerts.remove(activeAlerts.size() - 1);
        }

        synchronized (gridZones) {
            gridZones.clear();
            gridZones.addAll(updatedGrids);
        }
    }

    private double getEmissionFactor(String region) {
        switch (region) {
            case "Gachibowli":
            case "Miyapur":
                return -15.0; // LOW (cleaner areas)
            case "Hitech City":
            case "Banjara Hills":
            case "Jubilee Hills":
                return -5.0; // MEDIUM-LOW
            case "Mehdipatnam":
            case "Kukatpally":
                return 5.0; // MEDIUM-HIGH
            case "Secunderabad":
            case "Uppal":
            case "LB Nagar":
                return 15.0; // HIGH
            default:
                return 0.0;
        }
    }

    private String[] regions = { "Gachibowli", "Hitech City", "Banjara Hills", "Jubilee Hills", "Secunderabad",
            "Mehdipatnam", "Uppal", "LB Nagar", "Kukatpally", "Miyapur" };

    private String classifyAQI(double pm25) {
        if (pm25 <= 30)
            return "Good";
        if (pm25 <= 60)
            return "Moderate";
        if (pm25 <= 90)
            return "Poor";
        return "Very Poor";
    }

    /**
     * Calculates the city-wide baseline PM2.5 based on the time of day (Diurnal
     * Cycle).
     * Peaks during commuting hours and drops during late night.
     */
    private double calculateDiurnalBaseline() {
        int hour = LocalDateTime.now().getHour();
        // Baseline reference: 50.0 µg/m³
        if (hour >= 8 && hour <= 10) {
            return 65.0; // Morning Rush Hour (+15)
        } else if (hour >= 18 && hour <= 21) {
            return 70.0; // Evening Rush Hour (+20)
        } else if (hour >= 23 || hour <= 4) {
            return 35.0; // Late Night / Early Morning (-15)
        } else {
            return 50.0; // Standard Daytime Activity
        }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
    }

    public List<GridZone> getAllGrids() {
        return gridZones;
    }

    public List<GridZone> getHotspots() {
        return gridZones.stream()
                .sorted((g1, g2) -> {
                    int p1 = persistenceCounters.getOrDefault(g1.id(), 0);
                    int p2 = persistenceCounters.getOrDefault(g2.id(), 0);
                    if (p1 != p2)
                        return Integer.compare(p2, p1); // Higher persistence first
                    return Double.compare(g2.pm25Value(), g1.pm25Value()); // Then higher PM2.5
                })
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<Alert> getActiveAlerts() {
        return activeAlerts;
    }
}
