package com.tgpcb.hyperlocal.model;

import java.time.LocalDateTime;

public record Alert(
        String gridId,
        String gridName,
        double pm25Value,
        LocalDateTime timestamp,
        String severity) {
}
