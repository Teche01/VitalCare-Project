package com.vitalcare.backend.service;

import com.vitalcare.backend.dto.AppointmentRequest;
import com.vitalcare.backend.dto.AppointmentResponse;
import com.vitalcare.backend.entity.*;
import com.vitalcare.backend.enums.AppointmentStatus;
import com.vitalcare.backend.enums.ArrivalStatus;
import com.vitalcare.backend.enums.ReasonCategory;
import com.vitalcare.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {

        private final AppointmentRepository appointmentRepository;
        private final PatientRepository patientRepository;
        private final DoctorRepository doctorRepository;
        private final DoctorAvailabilityRepository availabilityRepository;

        public AppointmentService(
                        AppointmentRepository appointmentRepository,
                        PatientRepository patientRepository,
                        DoctorRepository doctorRepository,
                        DoctorAvailabilityRepository availabilityRepository) {
                this.appointmentRepository = appointmentRepository;
                this.patientRepository = patientRepository;
                this.doctorRepository = doctorRepository;
                this.availabilityRepository = availabilityRepository;
        }

        @Transactional
        public AppointmentResponse bookAppointment(
                        AppointmentRequest request) {

                Patient patient = patientRepository
                                .findById(request.getPatientId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Patient not found"));

                Doctor doctor = doctorRepository
                                .findById(request.getDoctorId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Doctor not found"));

                LocalDate appointmentDate = LocalDate.parse(
                                request.getAppointmentDate());

                LocalTime appointmentTime = LocalTime.parse(
                                request.getAppointmentTime());

                if (appointmentDate.isBefore(LocalDate.now())) {
                        throw new IllegalArgumentException(
                                        "Appointment date cannot be in the past");
                }

                if (appointmentDate.equals(
                                LocalDate.now())
                                &&
                                !appointmentTime.isAfter(
                                                LocalTime.now())) {

                        throw new IllegalArgumentException(
                                        "This appointment time has already passed");
                }

                DayOfWeek dayOfWeek = appointmentDate.getDayOfWeek();

                List<DoctorAvailability> schedules = availabilityRepository
                                .findByDoctorDoctorIdAndDayOfWeek(
                                                doctor.getDoctorId(),
                                                dayOfWeek);

                boolean validSlot = false;

                int consultationDuration = doctor.getConsultationDurationMinutes();

                for (DoctorAvailability schedule : schedules) {

                        LocalTime current = schedule.getStartTime();

                        while (!current
                                        .plusMinutes(consultationDuration)
                                        .isAfter(schedule.getEndTime())) {

                                if (current.equals(appointmentTime)) {
                                        validSlot = true;
                                        break;
                                }

                                current = current.plusMinutes(
                                                consultationDuration);
                        }

                        if (validSlot) {
                                break;
                        }
                }

                if (!validSlot) {
                        throw new IllegalArgumentException(
                                        "Selected time is not a valid doctor appointment slot");
                }

                boolean alreadyBooked = appointmentRepository
                                .existsByDoctorDoctorIdAndAppointmentDateAndAppointmentTimeAndAppointmentStatus(
                                                doctor.getDoctorId(),
                                                appointmentDate,
                                                appointmentTime,
                                                AppointmentStatus.BOOKED);

                if (alreadyBooked) {
                        throw new IllegalArgumentException(
                                        "Selected appointment slot is already booked");
                }

                ReasonCategory reasonCategory;

                try {
                        reasonCategory = ReasonCategory.valueOf(
                                        request.getReasonCategory()
                                                        .toUpperCase());
                } catch (IllegalArgumentException exception) {

                        throw new IllegalArgumentException(
                                        "Invalid reason category");
                }

                if (reasonCategory == ReasonCategory.OTHER
                                && (request.getReasonDetails() == null
                                                || request.getReasonDetails()
                                                                .isBlank())) {

                        throw new IllegalArgumentException(
                                        "Please describe the reason when Other is selected");
                }

                Appointment appointment = new Appointment();

                appointment.setPatient(patient);
                appointment.setDoctor(doctor);
                appointment.setAppointmentDate(
                                appointmentDate);
                appointment.setAppointmentTime(
                                appointmentTime);
                appointment.setReasonCategory(
                                reasonCategory);
                appointment.setReasonDetails(
                                request.getReasonDetails());
                appointment.setAppointmentStatus(
                                AppointmentStatus.BOOKED);
                appointment.setArrivalStatus(
                                ArrivalStatus.PENDING);

                Appointment savedAppointment = appointmentRepository.save(
                                appointment);

                return convertToResponse(
                                savedAppointment);
        }

        @Transactional
        public AppointmentResponse cancelAppointment(
                        Integer appointmentId,
                        Integer patientId) {

                Appointment appointment = appointmentRepository
                                .findById(appointmentId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Appointment not found"));

                if (!appointment.getPatient()
                                .getPatientId()
                                .equals(patientId)) {

                        throw new IllegalArgumentException(
                                        "This appointment does not belong to the patient");
                }

                if (appointment.getAppointmentStatus() != AppointmentStatus.BOOKED) {

                        throw new IllegalArgumentException(
                                        "Only booked appointments can be cancelled");
                }

                if (appointment.getArrivalStatus() == ArrivalStatus.ARRIVED) {

                        throw new IllegalArgumentException(
                                        "Appointment cannot be cancelled after patient arrival");
                }

                LocalDateTime appointmentDateTime = LocalDateTime.of(
                                appointment.getAppointmentDate(),
                                appointment.getAppointmentTime());

                if (!appointmentDateTime
                                .isAfter(LocalDateTime.now())) {

                        throw new IllegalArgumentException(
                                        "Past appointments cannot be cancelled");
                }

                appointment.setAppointmentStatus(
                                AppointmentStatus.CANCELLED);

                Appointment savedAppointment = appointmentRepository.save(
                                appointment);

                return convertToResponse(
                                savedAppointment);
        }

        public List<AppointmentResponse> getPatientAppointments(
                        Integer patientId) {

                return appointmentRepository
                                .findByPatientPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(
                                                patientId)
                                .stream()
                                .map(this::convertToResponse)
                                .toList();
        }

        private AppointmentResponse convertToResponse(
                        Appointment appointment) {

                return new AppointmentResponse(
                                appointment.getAppointmentId(),

                                appointment.getPatient()
                                                .getPatientId(),

                                appointment.getPatient()
                                                .getFullName(),

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
                                                .name());
        }

        public List<AppointmentResponse> getAllAppointments() {

                return appointmentRepository
                                .findAll()
                                .stream()
                                .map(this::convertToResponse)
                                .toList();
        }
}