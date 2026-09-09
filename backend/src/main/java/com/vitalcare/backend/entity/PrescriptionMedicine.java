package com.vitalcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "prescription_medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionMedicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prescription_medicine_id")
    private Integer prescriptionMedicineId;

    @ManyToOne
    @JoinColumn(
            name = "prescription_id",
            nullable = false
    )
    private Prescription prescription;

    @Column(name = "medicine_name", nullable = false)
    private String medicineName;

    private String dosage;

    private String frequency;

    private String duration;

    @Column(length = 500)
    private String instructions;
}