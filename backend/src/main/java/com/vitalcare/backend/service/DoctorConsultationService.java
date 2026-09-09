package com.vitalcare.backend.service;

import com.vitalcare.backend.dto.*;
import com.vitalcare.backend.entity.Appointment;
import com.vitalcare.backend.entity.Prescription;
import com.vitalcare.backend.entity.PrescriptionMedicine;
import com.vitalcare.backend.enums.AppointmentStatus;
import com.vitalcare.backend.enums.ArrivalStatus;
import com.vitalcare.backend.repository.AppointmentRepository;
import com.vitalcare.backend.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorConsultationService {

        private final AppointmentRepository appointmentRepository;
        private final PrescriptionRepository prescriptionRepository;

        public DoctorConsultationService(
                        AppointmentRepository appointmentRepository,
                        PrescriptionRepository prescriptionRepository) {
                this.appointmentRepository = appointmentRepository;

                this.prescriptionRepository = prescriptionRepository;
        }

        public List<ReceptionistAppointmentResponse> getArrivedPatientsForToday(
                        Integer doctorId) {

                return appointmentRepository
                                .findByDoctorDoctorIdAndAppointmentDateAndArrivalStatusAndAppointmentStatusOrderByAppointmentTimeAsc(
                                                doctorId,
                                                LocalDate.now(),
                                                ArrivalStatus.ARRIVED,
                                                AppointmentStatus.BOOKED)
                                .stream()
                                .map(this::convertAppointment)
                                .toList();
        }

        @Transactional
        public PrescriptionResponse createPrescription(
                        PrescriptionRequest request) {

                Appointment appointment = appointmentRepository
                                .findById(
                                                request.getAppointmentId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Appointment not found"));

                if (appointment.getArrivalStatus() != ArrivalStatus.ARRIVED) {

                        throw new IllegalArgumentException(
                                        "Patient has not been marked as arrived");
                }

                if (appointment.getAppointmentStatus() == AppointmentStatus.CANCELLED) {

                        throw new IllegalArgumentException(
                                        "Cannot create prescription for a cancelled appointment");
                }

                if (prescriptionRepository
                                .existsByAppointmentAppointmentId(
                                                appointment.getAppointmentId())) {

                        throw new IllegalArgumentException(
                                        "Prescription already exists for this appointment");
                }

                Prescription prescription = new Prescription();

                prescription.setAppointment(
                                appointment);

                prescription.setDoctor(
                                appointment.getDoctor());

                prescription.setPatient(
                                appointment.getPatient());

                prescription.setDiagnosis(
                                request.getDiagnosis());

                prescription.setConsultationNotes(
                                request.getConsultationNotes());

                prescription.setGeneralAdvice(
                                request.getGeneralAdvice());

                if (request.getFollowUpDate() != null
                                && !request.getFollowUpDate()
                                                .isBlank()) {

                        prescription.setFollowUpDate(
                                        LocalDate.parse(
                                                        request.getFollowUpDate()));
                }

                List<PrescriptionMedicine> medicines = new ArrayList<>();

                if (request.getMedicines() != null) {

                        for (MedicineRequest medicineRequest : request.getMedicines()) {

                                PrescriptionMedicine medicine = new PrescriptionMedicine();

                                medicine.setPrescription(
                                                prescription);

                                medicine.setMedicineName(
                                                medicineRequest
                                                                .getMedicineName());

                                medicine.setDosage(
                                                medicineRequest.getDosage());

                                medicine.setFrequency(
                                                medicineRequest.getFrequency());

                                medicine.setDuration(
                                                medicineRequest.getDuration());

                                medicine.setInstructions(
                                                medicineRequest
                                                                .getInstructions());

                                medicines.add(medicine);
                        }
                }

                prescription.setMedicines(medicines);

                Prescription savedPrescription = prescriptionRepository.save(
                                prescription);

                appointment.setAppointmentStatus(
                                AppointmentStatus.COMPLETED);

                appointmentRepository.save(
                                appointment);

                return convertPrescription(
                                savedPrescription);
        }

        public PrescriptionResponse getPrescriptionByAppointment(
                        Integer appointmentId) {

                Prescription prescription = prescriptionRepository
                                .findByAppointmentAppointmentId(
                                                appointmentId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Prescription not found"));

                return convertPrescription(
                                prescription);
        }

        public List<PrescriptionResponse> getPatientPrescriptions(
                        Integer patientId) {

                return prescriptionRepository
                                .findByPatientPatientIdOrderByCreatedAtDesc(
                                                patientId)
                                .stream()
                                .map(this::convertPrescription)
                                .toList();
        }

        private PrescriptionResponse convertPrescription(
                        Prescription prescription) {

                List<MedicineResponse> medicineResponses = prescription.getMedicines()
                                .stream()
                                .map(medicine -> new MedicineResponse(
                                                medicine.getMedicineName(),
                                                medicine.getDosage(),
                                                medicine.getFrequency(),
                                                medicine.getDuration(),
                                                medicine.getInstructions()))
                                .toList();

                String followUpDate = prescription.getFollowUpDate() != null
                                ? prescription
                                                .getFollowUpDate()
                                                .toString()
                                : null;

                return new PrescriptionResponse(
                                prescription.getPrescriptionId(),

                                prescription.getAppointment()
                                                .getAppointmentId(),

                                prescription.getPatient()
                                                .getFullName(),

                                prescription.getDoctor()
                                                .getFullName(),

                                prescription.getDoctor()
                                                .getSpecialization(),

                                prescription.getDoctor()
                                                .getDepartment()
                                                .getDepartmentName(),

                                prescription.getAppointment()
                                                .getAppointmentDate()
                                                .toString(),

                                prescription.getDiagnosis(),

                                prescription.getConsultationNotes(),

                                prescription.getGeneralAdvice(),

                                followUpDate,

                                medicineResponses);
        }

        private ReceptionistAppointmentResponse convertAppointment(
                        Appointment appointment) {

                String dateOfBirth = appointment.getPatient()
                                .getDateOfBirth() != null
                                                ? appointment.getPatient()
                                                                .getDateOfBirth()
                                                                .toString()
                                                : null;

                String arrivedAt = appointment.getArrivedAt() != null
                                ? appointment.getArrivedAt()
                                                .toString()
                                : null;

                return new ReceptionistAppointmentResponse(
                                appointment.getAppointmentId(),

                                appointment.getPatient()
                                                .getPatientId(),

                                appointment.getPatient()
                                                .getFullName(),

                                appointment.getPatient()
                                                .getPhone(),

                                appointment.getPatient()
                                                .getGender(),

                                dateOfBirth,

                                appointment.getDoctor()
                                                .getDoctorId(),

                                appointment.getDoctor()
                                                .getFullName(),

                                appointment.getDoctor()
                                                .getDepartment()
                                                .getDepartmentName(),

                                appointment.getAppointmentDate()
                                                .toString(),

                                appointment.getAppointmentTime()
                                                .toString(),

                                appointment.getReasonCategory()
                                                .name(),

                                appointment.getReasonDetails(),

                                appointment.getAppointmentStatus()
                                                .name(),

                                appointment.getArrivalStatus()
                                                .name(),

                                arrivedAt);
        }
}