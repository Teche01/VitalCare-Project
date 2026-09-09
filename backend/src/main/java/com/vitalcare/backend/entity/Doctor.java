package com.vitalcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private Integer doctorId;

    @OneToOne
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @ManyToOne
    @JoinColumn(
            name = "department_id",
            nullable = false
    )
    private Department department;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 100)
    private String specialization;

    @Column(length = 100)
    private String qualification;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(length = 15)
    private String phone;

    @Column(name = "consultation_duration_minutes")
    private Integer consultationDurationMinutes = 20;

    @Column(nullable = false)
    private Boolean active = true;
}