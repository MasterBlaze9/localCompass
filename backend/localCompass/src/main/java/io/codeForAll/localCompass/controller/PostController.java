package io.codeForAll.localCompass.controller;

import io.codeForAll.localCompass.dto.post.CreatePostDTO;
import io.codeForAll.localCompass.dto.post.PostResponseDTO;
import io.codeForAll.localCompass.entites.Building;
import io.codeForAll.localCompass.entites.Post;
import io.codeForAll.localCompass.entites.User;
import io.codeForAll.localCompass.entites.enums.PostStatus;
import io.codeForAll.localCompass.repositories.BuildingRepository;
import io.codeForAll.localCompass.repositories.PostRepository;
import io.codeForAll.localCompass.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private PostRepository postRepository;
    private UserRepository userRepository;
    private BuildingRepository buildingRepository;

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

    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(@RequestBody CreatePostDTO dto) {
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

    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> getPosts(
            @RequestParam (required = false) Long buildingId,
            @RequestParam(required = false) PostStatus status) {

        List<Post> posts;

        if (buildingId == null) {
            posts = postRepository.findAll();
        } else if (status != null) {
            posts = postRepository.findByBuildingIdAndStatus(buildingId, status);
        } else {
            posts = postRepository.findByBuildingId(buildingId);
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
        return dto;
    }
}
