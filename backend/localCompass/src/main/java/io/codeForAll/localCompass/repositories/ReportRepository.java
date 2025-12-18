package io.codeForAll.localCompass.repositories;

import io.codeForAll.localCompass.entites.Report;
import io.codeForAll.localCompass.entites.enums.ReportStatus;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends org.springframework.data.jpa.repository.JpaRepository<Report, Long> {
    java.util.List<Report> findByBuildingId(Long buildingId);
    java.util.List<Report> findByBuildingIdAndStatusOrderByCreatedAtDesc(Long buildingId, ReportStatus status);
    java.util.List<Report> findByUserId(Long userId);
}
