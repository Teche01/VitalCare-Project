package com.vitalcare.backend.service;

import com.vitalcare.backend.dto.DoctorAvailabilityRequest;
import com.vitalcare.backend.dto.DoctorAvailabilityResponse;
import com.vitalcare.backend.dto.TimeSlotResponse;
import com.vitalcare.backend.entity.Doctor;
import com.vitalcare.backend.entity.DoctorAvailability;
import com.vitalcare.backend.repository.DoctorAvailabilityRepository;
import com.vitalcare.backend.repository.DoctorRepository;
import org.springframework.stereotype.Service;
import com.vitalcare.backend.entity.Appointment;
import com.vitalcare.backend.enums.AppointmentStatus;
import com.vitalcare.backend.repository.AppointmentRepository;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorAvailabilityService {

        private final DoctorAvailabilityRepository availabilityRepository;

        private final DoctorRepository doctorRepository;

        private final AppointmentRepository appointmentRepository;

        public DoctorAvailabilityService(
                        DoctorAvailabilityRepository availabilityRepository,
                        DoctorRepository doctorRepository,
                        AppointmentRepository appointmentRepository) {
                this.availabilityRepository = availabilityRepository;

                this.doctorRepository = doctorRepository;

                this.appointmentRepository = appointmentRepository;
        }

        public DoctorAvailabilityResponse createAvailability(
                        DoctorAvailabilityRequest request) {

                Doctor doctor = doctorRepository
                                .findById(request.getDoctorId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Doctor not found"));

                DayOfWeek dayOfWeek = DayOfWeek.valueOf(
                                request.getDayOfWeek()
                                                .toUpperCase());

                LocalTime startTime = LocalTime.parse(
                                request.getStartTime());

                LocalTime endTime = LocalTime.parse(
                                request.getEndTime());

                if (!startTime.isBefore(endTime)) {
                        throw new IllegalArgumentException(
                                        "Start time must be before end time");
                }

                DoctorAvailability availability = new DoctorAvailability();

                availability.setDoctor(doctor);
                availability.setDayOfWeek(dayOfWeek);
                availability.setStartTime(startTime);
                availability.setEndTime(endTime);

                DoctorAvailability saved = availabilityRepository.save(
                                availability);

                return convertToResponse(saved);
        }

        public List<DoctorAvailabilityResponse> getDoctorAvailability(
                        Integer doctorId) {

                return availabilityRepository
                                .findByDoctorDoctorId(doctorId)
                                .stream()
                                .map(this::convertToResponse)
                                .toList();
        }

        public List<TimeSlotResponse> generateSlots(
                        Integer doctorId,
                        LocalDate date) {

                // =========================
                // FIND DOCTOR
                // =========================

                Doctor doctor = doctorRepository
                                .findById(doctorId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Doctor not found"));

                LocalDate today = LocalDate.now();

                // =========================
                // DO NOT ALLOW PAST DATES
                // =========================

                if (date.isBefore(today)) {

                        return new ArrayList<>();
                }

                // =========================
                // FIND DOCTOR SCHEDULE
                // =========================

                DayOfWeek dayOfWeek = date.getDayOfWeek();

                List<DoctorAvailability> schedules = availabilityRepository
                                .findByDoctorDoctorIdAndDayOfWeek(
                                                doctorId,
                                                dayOfWeek);

                List<TimeSlotResponse> slots = new ArrayList<>();

                if (schedules.isEmpty()) {

                        return slots;
                }

                // =========================
                // FIND ALREADY BOOKED TIMES
                // =========================

                List<Appointment> appointments = appointmentRepository
                                .findByDoctorDoctorIdAndAppointmentDate(
                                                doctorId,
                                                date);

                Set<LocalTime> bookedTimes = appointments
                                .stream()

                                .filter(appointment -> appointment.getAppointmentStatus() == AppointmentStatus.BOOKED)

                                .map(
                                                Appointment::getAppointmentTime)

                                .collect(
                                                Collectors.toSet());

                // =========================
                // DOCTOR CONSULTATION TIME
                // =========================

                int consultationDuration = doctor.getConsultationDurationMinutes();

                LocalTime currentTime = LocalTime.now();

                // =========================
                // GENERATE SLOTS
                // =========================

                for (DoctorAvailability schedule : schedules) {

                        LocalTime slotTime = schedule.getStartTime();

                        while (!slotTime
                                        .plusMinutes(
                                                        consultationDuration)
                                        .isAfter(
                                                        schedule.getEndTime())) {

                                // =========================
                                // REMOVE EXPIRED SLOTS
                                // =========================

                                boolean expiredSlot = date.equals(today)
                                                &&
                                                !slotTime.isAfter(
                                                                currentTime);

                                if (!expiredSlot) {

                                        boolean available = !bookedTimes.contains(
                                                        slotTime);

                                        slots.add(
                                                        new TimeSlotResponse(
                                                                        slotTime.toString(),
                                                                        available));
                                }

                                slotTime = slotTime.plusMinutes(
                                                consultationDuration);
                        }
                }

                return slots;
        }

        private DoctorAvailabilityResponse convertToResponse(
                        DoctorAvailability availability) {

                return new DoctorAvailabilityResponse(
                                availability.getAvailabilityId(),
                                availability.getDoctor()
                                                .getDoctorId(),
                                availability.getDoctor()
                                                .getFullName(),
                                availability.getDayOfWeek()
                                                .name(),
                                availability.getStartTime()
                                                .toString(),
                                availability.getEndTime()
                                                .toString());
        }

        @Transactional
        public void deleteAvailability(
                        Integer availabilityId) {

                DoctorAvailability availability = availabilityRepository
                                .findById(availabilityId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Doctor availability not found"));

                availabilityRepository.delete(
                                availability);
        }
}