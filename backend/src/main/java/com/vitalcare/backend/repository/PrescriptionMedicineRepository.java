package com.vitalcare.backend.repository;

import com.vitalcare.backend.entity.PrescriptionMedicine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionMedicineRepository
        extends JpaRepository<PrescriptionMedicine, Integer> {
}