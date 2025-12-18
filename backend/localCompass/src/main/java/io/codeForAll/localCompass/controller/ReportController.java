package io.codeForAll.localCompass.controller;

import io.codeForAll.localCompass.dto.report.CreateReportDTO;
import io.codeForAll.localCompass.dto.report.ReportResponseDTO;
import io.codeForAll.localCompass.dto.report.UpdateReportDTO;
import io.codeForAll.localCompass.entites.Building;
import io.codeForAll.localCompass.entites.Report;
import io.codeForAll.localCompass.entites.User;
import io.codeForAll.localCompass.entites.enums.ReportStatus;
import io.codeForAll.localCompass.repositories.BuildingRepository;
import io.codeForAll.localCompass.repositories.ReportRepository;
import io.codeForAll.localCompass.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired private ReportRepository reportRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private BuildingRepository buildingRepository;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByPhoneNumber(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));
    }

    @PostMapping
    public ResponseEntity<ReportResponseDTO> create(@RequestBody CreateReportDTO dto) {
        User auth = getCurrentUser();
        if (!auth.isAdmin() && !auth.getId().equals(dto.getUserId())) throw new RuntimeException("Forbidden");
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Building building = buildingRepository.findById(dto.getBuildingId()).orElseThrow(() -> new RuntimeException("Building not found"));
        Report r = new Report();
        r.setUser(user);
        r.setBuilding(building);
        r.setDescription(dto.getDescription());
        r.setLocationDetails(dto.getLocationDetails());
        r.setStatus(ReportStatus.OPEN);
        Report saved = reportRepository.save(r);
        ReportResponseDTO resp = new ReportResponseDTO(saved);
        resp.setTitle(dto.getTitle());
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReportResponseDTO> update(@PathVariable Long id, @RequestBody UpdateReportDTO dto) {
        Report r = reportRepository.findById(id).orElseThrow(() -> new RuntimeException("Report not found"));
        User auth = getCurrentUser();
        if (!auth.isAdmin() && !r.getUser().getId().equals(auth.getId())) throw new RuntimeException("Forbidden");
        if (dto.getDescription() != null) r.setDescription(dto.getDescription());
        if (dto.getLocationDetails() != null) r.setLocationDetails(dto.getLocationDetails());
        if (dto.getStatus() != null) r.setStatus(dto.getStatus());
        Report updated = reportRepository.save(r);
        ReportResponseDTO resp = new ReportResponseDTO(updated);
        resp.setTitle(dto.getTitle());
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Report r = reportRepository.findById(id).orElseThrow(() -> new RuntimeException("Report not found"));
        User auth = getCurrentUser();
        if (!auth.isAdmin() && !r.getUser().getId().equals(auth.getId())) throw new RuntimeException("Forbidden");
        reportRepository.delete(r);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ReportResponseDTO>> list(@RequestParam(required = false) Long buildingId,
                                                        @RequestParam(required = false) ReportStatus status,
                                                        @RequestParam(required = false) String scope) {
        User me = getCurrentUser();
        Long effectiveBuildingId = buildingId;
        if (effectiveBuildingId == null && me != null && me.getBuilding() != null) {
            effectiveBuildingId = me.getBuilding().getId();
        }
        List<Report> reports;
        if ("mine".equalsIgnoreCase(scope)) {
            reports = reportRepository.findByUserId(me.getId());
        } else {
            if (effectiveBuildingId != null && status != null) {
                reports = reportRepository.findByBuildingIdAndStatusOrderByCreatedAtDesc(effectiveBuildingId, status);
            } else if (effectiveBuildingId != null) {
                reports = reportRepository.findByBuildingId(effectiveBuildingId);
            } else {
                reports = reportRepository.findAll();
            }
        }
        List<ReportResponseDTO> response = reports.stream().map(ReportResponseDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
