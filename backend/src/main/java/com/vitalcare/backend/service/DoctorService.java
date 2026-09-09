package com.vitalcare.backend.service;

import com.vitalcare.backend.dto.DoctorRequest;
import com.vitalcare.backend.dto.DoctorResponse;
import com.vitalcare.backend.entity.Department;
import com.vitalcare.backend.entity.Doctor;
import com.vitalcare.backend.entity.User;
import com.vitalcare.backend.enums.Role;
import com.vitalcare.backend.repository.DepartmentRepository;
import com.vitalcare.backend.repository.DoctorRepository;
import com.vitalcare.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorService {

        private final DoctorRepository doctorRepository;
        private final UserRepository userRepository;
        private final DepartmentRepository departmentRepository;
        private final PasswordEncoder passwordEncoder;

        public DoctorService(
                        DoctorRepository doctorRepository,
                        UserRepository userRepository,
                        DepartmentRepository departmentRepository,
                        PasswordEncoder passwordEncoder) {

                this.doctorRepository = doctorRepository;
                this.userRepository = userRepository;
                this.departmentRepository = departmentRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @Transactional
        public DoctorResponse createDoctor(
                        DoctorRequest request) {

                if (userRepository.existsByEmail(
                                request.getEmail())) {

                        throw new IllegalArgumentException(
                                        "Email is already registered");
                }

                Department department = departmentRepository
                                .findById(request.getDepartmentId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Department not found"));

                User user = new User();

                user.setEmail(request.getEmail());

                user.setPassword(
                                passwordEncoder.encode(
                                                request.getPassword()));

                user.setRole(Role.DOCTOR);
                user.setActive(true);

                User savedUser = userRepository.save(user);

                Doctor doctor = new Doctor();

                doctor.setUser(savedUser);
                doctor.setDepartment(department);
                doctor.setFullName(request.getFullName());
                doctor.setSpecialization(
                                request.getSpecialization());
                doctor.setQualification(
                                request.getQualification());
                doctor.setExperienceYears(
                                request.getExperienceYears());
                doctor.setPhone(request.getPhone());

                doctor.setConsultationDurationMinutes(
                                request.getConsultationDurationMinutes() != null
                                                ? request.getConsultationDurationMinutes()
                                                : 20);

                doctor.setActive(true);

                Doctor savedDoctor = doctorRepository.save(doctor);

                return convertToResponse(savedDoctor);
        }

        @Transactional
        public DoctorResponse changeDoctorStatus(
                        Integer doctorId,
                        Boolean active) {

                Doctor doctor = doctorRepository
                                .findById(doctorId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Doctor not found"));

                doctor.setActive(active);

                if (doctor.getUser() != null) {
                        doctor.getUser().setActive(active);
                }

                Doctor savedDoctor = doctorRepository.save(doctor);

                return convertToResponse(
                                savedDoctor);
        }

        public List<DoctorResponse> getAllDoctors() {

                return doctorRepository.findAll()
                                .stream()
                                .map(this::convertToResponse)
                                .toList();
        }

        public List<DoctorResponse> getActiveDoctorsByDepartment(
                        Integer departmentId) {

                return doctorRepository
                                .findByDepartmentDepartmentIdAndActiveTrue(
                                                departmentId)
                                .stream()
                                .map(this::convertToResponse)
                                .toList();
        }

        public DoctorResponse getDoctorById(
                        Integer doctorId) {

                Doctor doctor = doctorRepository.findById(doctorId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Doctor not found"));

                return convertToResponse(doctor);
        }

        private DoctorResponse convertToResponse(
                        Doctor doctor) {

                return new DoctorResponse(
                                doctor.getDoctorId(),
                                doctor.getFullName(),
                                doctor.getUser().getEmail(),
                                doctor.getDepartment()
                                                .getDepartmentId(),
                                doctor.getDepartment()
                                                .getDepartmentName(),
                                doctor.getSpecialization(),
                                doctor.getQualification(),
                                doctor.getExperienceYears(),
                                doctor.getPhone(),
                                doctor.getConsultationDurationMinutes(),
                                doctor.getActive());
        }
}