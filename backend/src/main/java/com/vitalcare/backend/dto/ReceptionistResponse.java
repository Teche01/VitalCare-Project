package com.vitalcare.backend.dto;

public class ReceptionistResponse {

    private Integer receptionistId;
    private String fullName;
    private String email;
    private String phone;
    private Boolean active;

    public ReceptionistResponse(
            Integer receptionistId,
            String fullName,
            String email,
            String phone,
            Boolean active
    ) {
        this.receptionistId =
                receptionistId;

        this.fullName =
                fullName;

        this.email =
                email;

        this.phone =
                phone;

        this.active =
                active;
    }

    public Integer getReceptionistId() {
        return receptionistId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public Boolean getActive() {
        return active;
    }
}