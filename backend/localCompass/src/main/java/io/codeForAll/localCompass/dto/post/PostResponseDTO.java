package io.codeForAll.localCompass.dto.post;

import io.codeForAll.localCompass.entites.enums.PostStatus;

import java.time.LocalDateTime;

public class PostResponseDTO {

    private Long id;
    private String title;
    private String content;
    private PostStatus status;
    private LocalDateTime createdAt;
    private String authorName;
    private String authorUnit;
    private Long authorId;
    private Boolean acceptedByMe; // whether the current user has accepted this post

    public PostResponseDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public PostStatus getStatus() {
        return status;
    }

    public void setStatus(PostStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorUnit() {
        return authorUnit;
    }

    public void setAuthorUnit(String authorUnit) {
        this.authorUnit = authorUnit;
    }

    public Boolean getAcceptedByMe() {
        return acceptedByMe;
    }

    public void setAcceptedByMe(Boolean acceptedByMe) {
        this.acceptedByMe = acceptedByMe;
    }
}
