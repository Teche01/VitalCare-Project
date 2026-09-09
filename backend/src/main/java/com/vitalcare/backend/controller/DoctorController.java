package com.vitalcare.backend.controller;

import com.vitalcare.backend.dto.DoctorRequest;
import com.vitalcare.backend.dto.DoctorResponse;
import com.vitalcare.backend.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

        private final DoctorService doctorService;

        public DoctorController(
                        DoctorService doctorService) {
                this.doctorService = doctorService;
        }

        @PostMapping
        public ResponseEntity<DoctorResponse> createDoctor(
                        @Valid @RequestBody DoctorRequest request) {

                DoctorResponse response = doctorService.createDoctor(request);

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(response);
        }

        @GetMapping
        public List<DoctorResponse> getAllDoctors() {
                return doctorService.getAllDoctors();
        }

        @GetMapping("/{id}")
        public DoctorResponse getDoctorById(
                        @PathVariable Integer id) {

                return doctorService.getDoctorById(id);
        }

        @GetMapping("/department/{departmentId}")
        public List<DoctorResponse> getDoctorsByDepartment(
                        @PathVariable Integer departmentId) {

                return doctorService
                                .getActiveDoctorsByDepartment(
                                                departmentId);
        }

        @PatchMapping("/{doctorId}/status")
        public DoctorResponse changeDoctorStatus(
                        @PathVariable Integer doctorId,
                        @RequestParam Boolean active) {

                return doctorService
                                .changeDoctorStatus(
                                                doctorId,
                                                active);
        }
}