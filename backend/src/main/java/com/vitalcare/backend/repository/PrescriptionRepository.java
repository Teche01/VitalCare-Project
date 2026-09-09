package com.vitalcare.backend.repository;

import com.vitalcare.backend.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PrescriptionRepository
        extends JpaRepository<Prescription, Integer> {

    boolean existsByAppointmentAppointmentId(
            Integer appointmentId
    );

    Optional<Prescription>
    findByAppointmentAppointmentId(
            Integer appointmentId
    );

    List<Prescription>
    findByPatientPatientIdOrderByCreatedAtDesc(
            Integer patientId
    );
}