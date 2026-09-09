package com.vitalcare.backend.service;

import com.vitalcare.backend.dto.PatientRegistrationRequest;
import com.vitalcare.backend.dto.PatientRegistrationResponse;
import com.vitalcare.backend.entity.Patient;
import com.vitalcare.backend.entity.User;
import com.vitalcare.backend.enums.Role;
import com.vitalcare.backend.repository.PatientRepository;
import com.vitalcare.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PatientRegistrationService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientRegistrationService(
            UserRepository userRepository,
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public PatientRegistrationResponse registerPatient(
            PatientRegistrationRequest request
    ) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Email is already registered"
            );
        }

        User user = new User();

        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setRole(Role.PATIENT);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        Patient patient = new Patient();

        patient.setUser(savedUser);
        patient.setFullName(request.getFullName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setAddress(request.getAddress());

        Patient savedPatient =
                patientRepository.save(patient);

        return new PatientRegistrationResponse(
                savedPatient.getPatientId(),
                savedPatient.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                "Patient registered successfully"
        );
    }
}