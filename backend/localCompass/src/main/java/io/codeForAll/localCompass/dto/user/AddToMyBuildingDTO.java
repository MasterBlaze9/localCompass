package io.codeForAll.localCompass.dto.user;

public class AddToMyBuildingDTO {
    private String email;
    private String phoneNumber;
    private String unitNumber; // optional

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getUnitNumber() { return unitNumber; }
    public void setUnitNumber(String unitNumber) { this.unitNumber = unitNumber; }
}
