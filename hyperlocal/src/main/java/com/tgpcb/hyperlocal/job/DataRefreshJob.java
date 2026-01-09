package com.tgpcb.hyperlocal.job;

import com.tgpcb.hyperlocal.service.PollutionService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DataRefreshJob {

    private static final Logger logger = LoggerFactory.getLogger(DataRefreshJob.class);
    private final PollutionService pollutionService;

    public DataRefreshJob(PollutionService pollutionService) {
        this.pollutionService = pollutionService;
    }

    // Refresh data every 60 seconds
    @Scheduled(fixedRate = 60000)
    public void refreshData() {
        logger.info("Executing scheduled PM2.5 data refresh...");
        pollutionService.updatePollutionLevels();
        logger.info("Data refresh complete.");
    }
}
