package io.codeForAll.localCompass.dto.condominium;

public class CreateCondominiumDTO {

    private String name;
    private String address;
    private String adminEmail;

    public CreateCondominiumDTO() {
    }

    public CreateCondominiumDTO(String name, String address, String adminEmail) {
        this.name = name;
        this.address = address;
        this.adminEmail = adminEmail;
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

