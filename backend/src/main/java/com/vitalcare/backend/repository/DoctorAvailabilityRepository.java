package com.vitalcare.backend.repository;

import com.vitalcare.backend.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface DoctorAvailabilityRepository
        extends JpaRepository<DoctorAvailability, Integer> {

    List<DoctorAvailability>
    findByDoctorDoctorId(Integer doctorId);

    List<DoctorAvailability>
    findByDoctorDoctorIdAndDayOfWeek(
            Integer doctorId,
            DayOfWeek dayOfWeek
    );
}