package io.codeForAll.localCompass.repositories;

import io.codeForAll.localCompass.entites.Report;
import io.codeForAll.localCompass.entites.enums.ReportStatus;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository {

    List<Report> findByBuildingId(Long buildingId);
    List<Report> findByBuildingIdAndStatus(Long buildingId, ReportStatus status);
    List<Report> findByUserId(Long userId);
}
