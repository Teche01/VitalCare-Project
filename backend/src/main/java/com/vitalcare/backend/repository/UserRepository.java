package com.vitalcare.backend.repository;

import com.vitalcare.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.vitalcare.backend.enums.Role;

import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRole(Role role);
}