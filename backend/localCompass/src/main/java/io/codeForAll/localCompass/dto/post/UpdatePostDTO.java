package io.codeForAll.localCompass.dto.post;

import io.codeForAll.localCompass.entites.enums.PostStatus;

public class UpdatePostDTO {
    private String title;
    private String content;
    private PostStatus status;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public PostStatus getStatus() { return status; }
    public void setStatus(PostStatus status) { this.status = status; }
}
