package io.codeForAll.localCompass.dto.condominium;

import io.codeForAll.localCompass.entites.Condominium;

public class CondominiumDTO {

    private Long id;
    private String name;
    private String address;
    private String adminEmail;

    public CondominiumDTO() {
    }

    public CondominiumDTO(Condominium condominium) {
        this.id = condominium.getId();
        this.name = condominium.getName();
        this.address = condominium.getAddress();
        this.adminEmail = condominium.getAdminEmail();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAdminEmail() {
        return adminEmail;
    }

    public void setAdminEmail(String adminEmail) {
        this.adminEmail = adminEmail;
    }
}
