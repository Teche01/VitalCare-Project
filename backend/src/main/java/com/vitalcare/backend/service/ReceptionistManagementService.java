package com.vitalcare.backend.service;

import com.vitalcare.backend.dto.ReceptionistRequest;
import com.vitalcare.backend.dto.ReceptionistResponse;
import com.vitalcare.backend.entity.Receptionist;
import com.vitalcare.backend.entity.User;
import com.vitalcare.backend.enums.Role;
import com.vitalcare.backend.repository.ReceptionistRepository;
import com.vitalcare.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReceptionistManagementService {

    private final ReceptionistRepository
            receptionistRepository;

    private final UserRepository
            userRepository;

    private final PasswordEncoder
            passwordEncoder;

    public ReceptionistManagementService(
            ReceptionistRepository receptionistRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.receptionistRepository =
                receptionistRepository;

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;
    }

    @Transactional
    public ReceptionistResponse
            createReceptionist(
                    ReceptionistRequest request
            ) {

        if (userRepository
                .existsByEmail(
                        request.getEmail()
                )) {

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
                Role.RECEPTIONIST
        );

        user.setActive(true);

        User savedUser =
                userRepository.save(user);

        Receptionist receptionist =
                new Receptionist();

        receptionist.setUser(
                savedUser
        );

        receptionist.setFullName(
                request.getFullName()
        );

        receptionist.setPhone(
                request.getPhone()
        );

        receptionist.setActive(
                true
        );

        Receptionist savedReceptionist =
                receptionistRepository.save(
                        receptionist
                );

        return convertToResponse(
                savedReceptionist
        );
    }

    public List<ReceptionistResponse>
            getAllReceptionists() {

        return receptionistRepository
                .findAll()
                .stream()
                .map(
                        this::convertToResponse
                )
                .toList();
    }

    @Transactional
    public ReceptionistResponse
            changeReceptionistStatus(
                    Integer receptionistId,
                    Boolean active
            ) {

        Receptionist receptionist =
                receptionistRepository
                        .findById(
                                receptionistId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Receptionist not found"
                                ));

        receptionist.setActive(
                active
        );

        if (receptionist.getUser() != null) {

            receptionist.getUser()
                    .setActive(active);
        }

        Receptionist savedReceptionist =
                receptionistRepository
                        .save(receptionist);

        return convertToResponse(
                savedReceptionist
        );
    }

    private ReceptionistResponse
            convertToResponse(
                    Receptionist receptionist
            ) {

        return new ReceptionistResponse(

                receptionist
                        .getReceptionistId(),

                receptionist
                        .getFullName(),

                receptionist
                        .getUser()
                        .getEmail(),

                receptionist
                        .getPhone(),

                receptionist
                        .getActive()
        );
    }
}