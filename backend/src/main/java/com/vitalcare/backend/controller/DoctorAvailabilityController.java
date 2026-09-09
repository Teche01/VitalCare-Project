package com.vitalcare.backend.controller;

import com.vitalcare.backend.dto.DoctorAvailabilityRequest;
import com.vitalcare.backend.dto.DoctorAvailabilityResponse;
import com.vitalcare.backend.dto.TimeSlotResponse;
import com.vitalcare.backend.service.DoctorAvailabilityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctor-availability")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorAvailabilityController {

        private final DoctorAvailabilityService availabilityService;

        public DoctorAvailabilityController(
                        DoctorAvailabilityService availabilityService) {
                this.availabilityService = availabilityService;
        }

        @PostMapping
        public ResponseEntity<DoctorAvailabilityResponse> createAvailability(
                        @Valid @RequestBody DoctorAvailabilityRequest request) {

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(
                                                availabilityService
                                                                .createAvailability(
                                                                                request));
        }

        @GetMapping("/doctor/{doctorId}")
        public List<DoctorAvailabilityResponse> getAvailability(
                        @PathVariable Integer doctorId) {

                return availabilityService
                                .getDoctorAvailability(
                                                doctorId);
        }

        @GetMapping("/doctor/{doctorId}/slots")
        public List<TimeSlotResponse> getSlots(
                        @PathVariable Integer doctorId,
                        @RequestParam LocalDate date) {

                return availabilityService
                                .generateSlots(
                                                doctorId,
                                                date);
        }

        @DeleteMapping("/{availabilityId}")
        public ResponseEntity<Void> deleteAvailability(
                        @PathVariable Integer availabilityId) {

                availabilityService
                                .deleteAvailability(
                                                availabilityId);

                return ResponseEntity.noContent()
                                .build();
        }
}