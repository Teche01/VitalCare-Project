package com.vitalcare.backend.repository;

import com.vitalcare.backend.entity.Appointment;
import com.vitalcare.backend.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import com.vitalcare.backend.enums.ArrivalStatus;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository
                extends JpaRepository<Appointment, Integer> {

        boolean existsByDoctorDoctorIdAndAppointmentDateAndAppointmentTimeAndAppointmentStatus(
                        Integer doctorId,
                        LocalDate appointmentDate,
                        LocalTime appointmentTime,
                        AppointmentStatus appointmentStatus);

        List<Appointment> findByPatientPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(
                        Integer patientId);

        List<Appointment> findByDoctorDoctorIdAndAppointmentDate(
                        Integer doctorId,
                        LocalDate appointmentDate);

        List<Appointment> findByAppointmentDateOrderByAppointmentTimeAsc(
                        LocalDate appointmentDate);

        List<Appointment> findByAppointmentDateAndPatientFullNameContainingIgnoreCaseOrderByAppointmentTimeAsc(
                        LocalDate appointmentDate,
                        String patientName);

        List<Appointment> findByAppointmentDateAndPatientPhoneContainingOrderByAppointmentTimeAsc(
                        LocalDate appointmentDate,
                        String phone);

        List<Appointment> findByDoctorDoctorIdAndAppointmentDateAndArrivalStatusAndAppointmentStatusOrderByAppointmentTimeAsc(
                        Integer doctorId,
                        LocalDate appointmentDate,
                        ArrivalStatus arrivalStatus,
                        AppointmentStatus appointmentStatus);

        long countByAppointmentDate(
                        LocalDate appointmentDate);

        long countByAppointmentStatus(
                        AppointmentStatus appointmentStatus);

        List<Appointment> findByAppointmentDateAndAppointmentStatusOrderByAppointmentTimeAsc(
                        LocalDate appointmentDate,
                        AppointmentStatus appointmentStatus);

        List<Appointment> findByAppointmentDateAndAppointmentStatusAndPatientFullNameContainingIgnoreCaseOrderByAppointmentTimeAsc(
                        LocalDate appointmentDate,
                        AppointmentStatus appointmentStatus,
                        String patientName);

        List<Appointment> findByAppointmentDateAndAppointmentStatusAndPatientPhoneContainingOrderByAppointmentTimeAsc(
                        LocalDate appointmentDate,
                        AppointmentStatus appointmentStatus,
                        String phone);
}