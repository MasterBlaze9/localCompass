package io.codeForAll.localCompass.repositories;

import io.codeForAll.localCompass.entites.Post;
import io.codeForAll.localCompass.entites.enums.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByBuildingId(Long buildingId);
    List<Post> findByBuildingIdAndStatusOrderByCreatedAtDesc(Long buildingId, PostStatus status);
    List<Post> findByUserId(Long userId);
    List<Post> findByStatusOrderByCreatedAtAsc(PostStatus status);
    List<Post> findByStatusOrderByCreatedAtDesc(PostStatus status);



}
