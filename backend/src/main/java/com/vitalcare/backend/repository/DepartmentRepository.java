package com.vitalcare.backend.repository;

import com.vitalcare.backend.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository
        extends JpaRepository<Department, Integer> {

    boolean existsByDepartmentNameIgnoreCase(String departmentName);

    List<Department> findByActiveTrue();
}