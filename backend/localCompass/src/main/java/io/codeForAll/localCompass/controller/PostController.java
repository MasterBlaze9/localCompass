package io.codeForAll.localCompass.controller;

import io.codeForAll.localCompass.dto.post.CreatePostDTO;
import io.codeForAll.localCompass.dto.post.PostResponseDTO;
import io.codeForAll.localCompass.dto.post.UpdatePostDTO;
import io.codeForAll.localCompass.dto.post.PostAcceptanceDTO;
import io.codeForAll.localCompass.entites.Building;
import io.codeForAll.localCompass.entites.Post;
import io.codeForAll.localCompass.entites.PostAcceptance;
import io.codeForAll.localCompass.entites.User;
import io.codeForAll.localCompass.entites.enums.PostStatus;
import io.codeForAll.localCompass.entites.enums.RsvpStatus;
import io.codeForAll.localCompass.repositories.BuildingRepository;
import io.codeForAll.localCompass.repositories.PostAcceptanceRepository;
import io.codeForAll.localCompass.repositories.PostRepository;
import io.codeForAll.localCompass.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private PostRepository postRepository;
    private UserRepository userRepository;
    private BuildingRepository buildingRepository;
    private PostAcceptanceRepository postAcceptanceRepository;

    @Autowired
    public void setPostRepository(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setBuildingRepository(BuildingRepository buildingRepository) {
        this.buildingRepository = buildingRepository;
    }

    @Autowired
    public void setPostAcceptanceRepository(PostAcceptanceRepository postAcceptanceRepository) {
        this.postAcceptanceRepository = postAcceptanceRepository;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByPhoneNumber(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));
    }

    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(@RequestBody CreatePostDTO dto) {
        User authUser = getCurrentUser();
        if (!authUser.isAdmin() && !authUser.getId().equals(dto.getUserId())) {
            throw new RuntimeException("Forbidden");
        }
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Building building = buildingRepository.findById(dto.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Building not found"));

        Post post = new Post();
        post.setUser(user);
        post.setBuilding(building);
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setStatus(PostStatus.OPEN);

        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(mapToResponseDTO(savedPost));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDTO> updatePost(@PathVariable Long id, @RequestBody UpdatePostDTO dto) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        User authUser = getCurrentUser();
        if (!authUser.isAdmin() && !post.getUser().getId().equals(authUser.getId())) {
            throw new RuntimeException("Forbidden");
        }
        if (dto.getTitle() != null) post.setTitle(dto.getTitle());
        if (dto.getContent() != null) post.setContent(dto.getContent());
        if (dto.getStatus() != null) post.setStatus(dto.getStatus());
        Post updated = postRepository.save(post);
        return ResponseEntity.ok(mapToResponseDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<PostResponseDTO> deletePost(@PathVariable Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        User authUser = getCurrentUser();
        if (!authUser.isAdmin() && !post.getUser().getId().equals(authUser.getId())) {
            throw new RuntimeException("Forbidden");
        }
        // Remove acceptances to satisfy FK constraints
        postAcceptanceRepository.findByPostId(id).forEach(postAcceptanceRepository::delete);
        postRepository.delete(post);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{postId}/acceptances")
    public ResponseEntity<PostAcceptanceDTO> acceptPost(@PathVariable Long postId, @RequestParam Long userId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User authUser = getCurrentUser();
        if (!authUser.isAdmin() && !authUser.getId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        postAcceptanceRepository.findByPostIdAndUserId(postId, userId)
                .ifPresent(a -> { throw new RuntimeException("Already accepted"); });
        PostAcceptance a = new PostAcceptance();
        a.setPost(post);
        a.setUser(user);
        a.setStatus(RsvpStatus.PENDING);
        PostAcceptance saved = (PostAcceptance) postAcceptanceRepository.save(a);
        return ResponseEntity.ok(new PostAcceptanceDTO(saved));
    }

    @PatchMapping("/{postId}/acceptances/{userId}")
    public ResponseEntity<PostAcceptanceDTO> updateAcceptance(@PathVariable Long postId,
                                                              @PathVariable Long userId,
                                                              @RequestParam(required = false) RsvpStatus status) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User authUser = getCurrentUser();
        if (!authUser.isAdmin() && !authUser.getId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }
        PostAcceptance acceptance = postAcceptanceRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new RuntimeException("Acceptance not found"));
        acceptance.setStatus(status != null ? status : RsvpStatus.PENDING);
        PostAcceptance updated = postAcceptanceRepository.save(acceptance);
        return ResponseEntity.ok(new PostAcceptanceDTO(updated));
    }

    @GetMapping("/{postId}/acceptances")
    public ResponseEntity<List<PostAcceptanceDTO>> listAcceptances(@PathVariable Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User authUser = getCurrentUser();
        if (!authUser.isAdmin() && !post.getUser().getId().equals(authUser.getId())) {
            throw new RuntimeException("Forbidden");
        }
        List<PostAcceptanceDTO> response = postAcceptanceRepository.findByPostId(postId)
                .stream().map(PostAcceptanceDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Remove my acceptance
    @DeleteMapping("/{postId}/acceptances")
    public ResponseEntity<Void> removeMyAcceptance(@PathVariable Long postId) {
        User authUser = getCurrentUser();
        PostAcceptance acceptance = postAcceptanceRepository.findByPostIdAndUserId(postId, authUser.getId())
                .orElseThrow(() -> new RuntimeException("Acceptance not found"));
        postAcceptanceRepository.delete(acceptance);
        return ResponseEntity.noContent().build();
    }

    // Admin remove a user's acceptance
    @DeleteMapping("/{postId}/acceptances/{userId}")
    public ResponseEntity<Void> removeAcceptance(@PathVariable Long postId, @PathVariable Long userId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User authUser = getCurrentUser();
        if (!authUser.isAdmin() && !post.getUser().getId().equals(authUser.getId())) {
            throw new RuntimeException("Forbidden");
        }
        PostAcceptance acceptance = postAcceptanceRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new RuntimeException("Acceptance not found"));
        postAcceptanceRepository.delete(acceptance);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> getPosts(
            @RequestParam(required = false) Long buildingId,
            @RequestParam(required = false) PostStatus status,
            @RequestParam(required = false) String scope) {

        User me = getCurrentUser();

        // If admin, force filtering by their building (when assigned)
        Long effectiveBuildingId = buildingId;
        if (me != null && me.isAdmin() && me.getBuilding() != null) {
            effectiveBuildingId = me.getBuilding().getId();
        }

        List<Post> posts;
        if ("mine".equalsIgnoreCase(scope)) {
            posts = postRepository.findByUserId(me.getId());
        } else if ("accepted".equalsIgnoreCase(scope)) {
            List<Long> ids = postAcceptanceRepository.findByUserId(me.getId()).stream()
                    .map(pa -> pa.getPost().getId()).toList();
            posts = ids.isEmpty() ? List.of() : postRepository.findAllById(ids);
        } else if ("available".equalsIgnoreCase(scope)) {
            Long bId = (me != null && me.getBuilding() != null) ? me.getBuilding().getId() : effectiveBuildingId;
            List<Post> base = (bId != null) ? postRepository.findByBuildingIdAndStatusOrderByCreatedAtDesc(bId, PostStatus.OPEN) : postRepository.findByStatusOrderByCreatedAtDesc(PostStatus.OPEN);
            var acceptedIds = postAcceptanceRepository.findByUserId(me.getId()).stream().map(pa -> pa.getPost().getId()).collect(java.util.stream.Collectors.toSet());
            posts = base.stream()
                    .filter(p -> !p.getUser().getId().equals(me.getId()))
                    .filter(p -> !acceptedIds.contains(p.getId()))
                    .collect(java.util.stream.Collectors.toList());
        } else {
            if (effectiveBuildingId != null && status != null) {
                posts = postRepository.findByBuildingIdAndStatusOrderByCreatedAtDesc(effectiveBuildingId, status);
            } else if (effectiveBuildingId != null) {
                posts = postRepository.findByBuildingId(effectiveBuildingId);
            } else if (status != null) {
                posts = postRepository.findByStatusOrderByCreatedAtDesc(status);
            } else {
                posts = postRepository.findAll();
            }
        }

        List<PostResponseDTO> response = posts.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private PostResponseDTO mapToResponseDTO(Post post) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setStatus(post.getStatus());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setAuthorName(post.getUser().getFirstName() + " " + post.getUser().getLastName());
        dto.setAuthorUnit(post.getUser().getUnitNumber());
        dto.setAuthorId(post.getUser().getId());
        dto.setBuildingName(post.getBuilding().getName());
        dto.setAcceptancesCount(postAcceptanceRepository.findByPostId(post.getId()).size());
        try {
            User me = getCurrentUser();
            if (me != null) {
                boolean accepted = postAcceptanceRepository.findByPostIdAndUserId(post.getId(), me.getId()).isPresent();
                dto.setAcceptedByMe(accepted);
            }
        } catch (Exception ignored) { /* no-op */ }
        return dto;
    }
}
