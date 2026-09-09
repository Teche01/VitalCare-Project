package com.vitalcare.backend.service;

import com.vitalcare.backend.dto.DepartmentRequest;
import com.vitalcare.backend.entity.Department;
import com.vitalcare.backend.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(
            DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public List<Department> getActiveDepartments() {
        return departmentRepository.findByActiveTrue();
    }

    public Department getDepartmentById(Integer id) {
        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department not found"
                        ));
    }

    public Department createDepartment(
            DepartmentRequest request) {

        if (departmentRepository
                .existsByDepartmentNameIgnoreCase(
                        request.getDepartmentName())) {

            throw new IllegalArgumentException(
                    "Department already exists"
            );
        }

        Department department = new Department();

        department.setDepartmentName(
                request.getDepartmentName()
        );

        department.setDescription(
                request.getDescription()
        );

        department.setActive(true);

        return departmentRepository.save(department);
    }

    public Department updateDepartment(
            Integer id,
            DepartmentRequest request) {

        Department department =
                getDepartmentById(id);

        department.setDepartmentName(
                request.getDepartmentName()
        );

        department.setDescription(
                request.getDescription()
        );

        return departmentRepository.save(department);
    }

    public Department changeDepartmentStatus(
            Integer id,
            Boolean active) {

        Department department =
                getDepartmentById(id);

        department.setActive(active);

        return departmentRepository.save(department);
    }
}