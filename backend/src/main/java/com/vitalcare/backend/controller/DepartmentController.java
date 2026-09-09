package com.vitalcare.backend.controller;

import com.vitalcare.backend.dto.DepartmentRequest;
import com.vitalcare.backend.entity.Department;
import com.vitalcare.backend.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:5173")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(
            DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    @GetMapping("/active")
    public List<Department> getActiveDepartments() {
        return departmentService.getActiveDepartments();
    }

    @GetMapping("/{id}")
    public Department getDepartmentById(
            @PathVariable Integer id) {
        return departmentService.getDepartmentById(id);
    }

    @PostMapping
    public Department createDepartment(
            @Valid
            @RequestBody DepartmentRequest request) {

        return departmentService
                .createDepartment(request);
    }

    @PutMapping("/{id}")
    public Department updateDepartment(
            @PathVariable Integer id,
            @Valid
            @RequestBody DepartmentRequest request) {

        return departmentService
                .updateDepartment(id, request);
    }

    @PatchMapping("/{id}/status")
    public Department changeStatus(
            @PathVariable Integer id,
            @RequestParam Boolean active) {

        return departmentService
                .changeDepartmentStatus(id, active);
    }
}