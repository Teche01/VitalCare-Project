package com.vitalcare.backend.repository;

import com.vitalcare.backend.entity.Receptionist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReceptionistRepository
        extends JpaRepository<Receptionist, Integer> {

    Optional<Receptionist> findByUserUserId(Integer userId);
}