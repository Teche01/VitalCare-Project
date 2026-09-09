package com.vitalcare.backend.service;

import com.vitalcare.backend.dto.AdminSetupRequest;
import com.vitalcare.backend.dto.AdminSetupResponse;
import com.vitalcare.backend.entity.User;
import com.vitalcare.backend.enums.Role;
import com.vitalcare.backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminSetupService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSetupService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;
    }

    @Transactional
    public AdminSetupResponse createInitialAdmin(
            AdminSetupRequest request
    ) {

        if (
                userRepository.existsByRole(
                        Role.ADMIN
                )
        ) {
            throw new IllegalArgumentException(
                    "Administrator account has already been created"
            );
        }

        if (
                userRepository.existsByEmail(
                        request.getEmail()
                )
        ) {
            throw new IllegalArgumentException(
                    "Email already exists"
            );
        }

        User user =
                new User();

        user.setEmail(
                request.getEmail()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(
                Role.ADMIN
        );

        user.setActive(
                true
        );

        User savedUser =
                userRepository.save(
                        user
                );

        return new AdminSetupResponse(
                savedUser.getUserId(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                "Initial administrator created successfully"
        );
    }
}