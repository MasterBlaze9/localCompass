package io.codeForAll.localCompass.dto.post;

import io.codeForAll.localCompass.entites.PostAcceptance;
import io.codeForAll.localCompass.entites.enums.RsvpStatus;

public class PostAcceptanceDTO {
    private Long userId;
    private String userName;
    private RsvpStatus status;

    public PostAcceptanceDTO() {}

    public PostAcceptanceDTO(PostAcceptance a) {
        this.userId = a.getUser().getId();
        this.userName = a.getUser().getFirstName() + " " + a.getUser().getLastName();
        this.status = a.getStatus();
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public RsvpStatus getStatus() { return status; }
    public void setStatus(RsvpStatus status) { this.status = status; }
}
