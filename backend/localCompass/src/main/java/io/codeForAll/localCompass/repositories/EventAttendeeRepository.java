package io.codeForAll.localCompass.repositories;

import io.codeForAll.localCompass.entites.EventAttendee;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventAttendeeRepository extends CrudRepository<EventAttendee, Long> {

    List<EventAttendee> findByEventId(Long eventId);
    List<EventAttendee> findByUserId(Long userId);
    Optional<EventAttendee> findByEventIdAndUserId(Long eventId, Long userId);
}
