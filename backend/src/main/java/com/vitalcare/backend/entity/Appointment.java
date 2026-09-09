package com.vitalcare.backend.entity;

import com.vitalcare.backend.enums.AppointmentStatus;
import com.vitalcare.backend.enums.ArrivalStatus;
import com.vitalcare.backend.enums.ReasonCategory;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "appointment_id")
        private Integer appointmentId;

        @ManyToOne
        @JoinColumn(name = "patient_id", nullable = false)
        private Patient patient;

        @ManyToOne
        @JoinColumn(name = "doctor_id", nullable = false)
        private Doctor doctor;

        @Column(name = "appointment_date", nullable = false)
        private LocalDate appointmentDate;

        @Column(name = "appointment_time", nullable = false)
        private LocalTime appointmentTime;

        @Enumerated(EnumType.STRING)
        @Column(name = "reason_category", nullable = false)
        private ReasonCategory reasonCategory;

        @Column(name = "reason_details", length = 500)
        private String reasonDetails;

        @Enumerated(EnumType.STRING)
        @Column(name = "appointment_status", nullable = false)
        private AppointmentStatus appointmentStatus = AppointmentStatus.BOOKED;

        @Enumerated(EnumType.STRING)
        @Column(name = "arrival_status", nullable = false)
        private ArrivalStatus arrivalStatus = ArrivalStatus.PENDING;

        @Column(name = "arrived_at")
        private LocalDateTime arrivedAt;
        @Column(name = "created_at", nullable = false)
        private LocalDateTime createdAt = LocalDateTime.now();
}