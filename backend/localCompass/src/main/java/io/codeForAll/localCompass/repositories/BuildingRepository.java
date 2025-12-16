package io.codeForAll.localCompass.repositories;

import io.codeForAll.localCompass.entites.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {
    Optional<Building> findByName(String name);
    List<Building> findByCondominiumId(Long condominiumId);
    Optional<Building> findBuildingById(Long id);

}
