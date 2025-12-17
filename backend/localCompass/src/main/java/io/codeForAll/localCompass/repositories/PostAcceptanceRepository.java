package io.codeForAll.localCompass.repositories;

import io.codeForAll.localCompass.entites.PostAcceptance;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostAcceptanceRepository extends CrudRepository<PostAcceptance, Long> {
    List<PostAcceptance> findByPostId(Long postId);
    Optional<PostAcceptance> findByPostIdAndUserId(Long postId, Long userId);
    List<PostAcceptance> findByUserId(Long userId);
}
