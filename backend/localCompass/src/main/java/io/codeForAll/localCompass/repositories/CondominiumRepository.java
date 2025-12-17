package io.codeForAll.localCompass.repositories;

import io.codeForAll.localCompass.entites.Condominium;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CondominiumRepository extends JpaRepository<Condominium, Long> {
    Optional<Condominium> findById(Long id);
}
