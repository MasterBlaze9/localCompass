package io.codeForAll.localCompass.repositories;

import io.codeForAll.localCompass.entites.Event;
import io.codeForAll.localCompass.entites.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByBuildingId(Long buildingId);
    List<Event> findByBuildingIdAndStatus(Long buildingId, EventStatus status);
    List<Event> findByBuildingIdOrderByDatetimeAsc(Long buildingId);
    List<Event> findEventByStatusOrderByDatetimeAsc(EventStatus status);
    List<Event> findEventByStatusOrderByDatetimeDesc(EventStatus status);
}
