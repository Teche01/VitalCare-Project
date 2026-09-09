package com.vitalcare.backend.service;

import com.vitalcare.backend.dto.ReceptionistAppointmentResponse;
import com.vitalcare.backend.entity.Appointment;
import com.vitalcare.backend.enums.AppointmentStatus;
import com.vitalcare.backend.enums.ArrivalStatus;
import com.vitalcare.backend.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReceptionistService {

        private final AppointmentRepository appointmentRepository;

        public ReceptionistService(
                        AppointmentRepository appointmentRepository) {
                this.appointmentRepository = appointmentRepository;
        }

        public List<ReceptionistAppointmentResponse> getTodaysAppointments() {

                return appointmentRepository
                                .findByAppointmentDateAndAppointmentStatusOrderByAppointmentTimeAsc(
                                                LocalDate.now(),
                                                AppointmentStatus.BOOKED)
                                .stream()
                                .map(this::convertToResponse)
                                .toList();
        }

        public ReceptionistAppointmentResponse getAppointmentById(
                        Integer appointmentId) {

                Appointment appointment = appointmentRepository
                                .findById(appointmentId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Appointment not found"));

                return convertToResponse(appointment);
        }

        public List<ReceptionistAppointmentResponse> searchByPatientName(
                        String patientName) {

                return appointmentRepository
                                .findByAppointmentDateAndAppointmentStatusAndPatientFullNameContainingIgnoreCaseOrderByAppointmentTimeAsc(
                                                LocalDate.now(),
                                                AppointmentStatus.BOOKED,
                                                patientName)
                                .stream()
                                .map(this::convertToResponse)
                                .toList();
        }

        public List<ReceptionistAppointmentResponse> searchByPhone(
                        String phone) {

                return appointmentRepository
                                .findByAppointmentDateAndAppointmentStatusAndPatientPhoneContainingOrderByAppointmentTimeAsc(
                                                LocalDate.now(),
                                                AppointmentStatus.BOOKED,
                                                phone)
                                .stream()
                                .map(this::convertToResponse)
                                .toList();
        }

        @Transactional
        public ReceptionistAppointmentResponse markPatientArrived(
                        Integer appointmentId) {

                Appointment appointment = appointmentRepository
                                .findById(appointmentId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Appointment not found"));

                if (appointment.getAppointmentStatus() != AppointmentStatus.BOOKED) {

                        throw new IllegalArgumentException(
                                        "Only booked appointments can be marked as arrived");
                }

                if (!appointment.getAppointmentDate()
                                .equals(LocalDate.now())) {

                        throw new IllegalArgumentException(
                                        "Only today's appointments can be marked as arrived");
                }

                if (appointment.getArrivalStatus() == ArrivalStatus.ARRIVED) {

                        throw new IllegalArgumentException(
                                        "Patient is already marked as arrived");
                }

                appointment.setArrivalStatus(
                                ArrivalStatus.ARRIVED);

                appointment.setArrivedAt(
                                LocalDateTime.now());

                Appointment savedAppointment = appointmentRepository.save(
                                appointment);

                return convertToResponse(
                                savedAppointment);
        }

        private ReceptionistAppointmentResponse convertToResponse(
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

        @Transactional
        public ReceptionistAppointmentResponse markNoShow(
                        Integer appointmentId) {

                Appointment appointment = appointmentRepository
                                .findById(appointmentId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Appointment not found"));

                // Appointment must still be booked

                if (appointment.getAppointmentStatus() != AppointmentStatus.BOOKED) {

                        throw new IllegalArgumentException(
                                        "Only booked appointments can be marked as no-show");
                }

                // Patient must not already have arrived

                if (appointment.getArrivalStatus() != ArrivalStatus.PENDING) {

                        throw new IllegalArgumentException(
                                        "An arrived patient cannot be marked as no-show");
                }

                // No-show is only applicable on appointment date

                if (!appointment.getAppointmentDate()
                                .equals(LocalDate.now())) {

                        throw new IllegalArgumentException(
                                        "No-show can only be marked on the appointment date");
                }

                // Appointment date + time

                LocalDateTime appointmentDateTime = LocalDateTime.of(
                                appointment.getAppointmentDate(),
                                appointment.getAppointmentTime());

                // 15-minute grace period

                LocalDateTime noShowAllowedTime = appointmentDateTime
                                .plusMinutes(15);

                if (LocalDateTime.now()
                                .isBefore(
                                                noShowAllowedTime)) {

                        throw new IllegalArgumentException(
                                        "Patient cannot be marked as no-show before the 15-minute grace period");
                }

                appointment.setAppointmentStatus(
                                AppointmentStatus.NO_SHOW);

                Appointment savedAppointment = appointmentRepository.save(
                                appointment);

                return convertToResponse(
                                savedAppointment);
        }
}