package com.vitalcare.backend.repository;

import com.vitalcare.backend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface DoctorRepository
        extends JpaRepository<Doctor, Integer> {

    List<Doctor>
    findByDepartmentDepartmentId(Integer departmentId);

    List<Doctor>
    findByDepartmentDepartmentIdAndActiveTrue(
            Integer departmentId);

    List<Doctor> findByActiveTrue();

    Optional<Doctor> findByUserUserId(Integer userId);
}