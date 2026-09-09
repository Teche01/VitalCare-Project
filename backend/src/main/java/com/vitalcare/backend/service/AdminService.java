package com.vitalcare.backend.service;

import com.vitalcare.backend.dto.AdminDashboardStatsResponse;
import com.vitalcare.backend.enums.AppointmentStatus;
import com.vitalcare.backend.repository.AppointmentRepository;
import com.vitalcare.backend.repository.DepartmentRepository;
import com.vitalcare.backend.repository.DoctorRepository;
import com.vitalcare.backend.repository.PatientRepository;
import com.vitalcare.backend.repository.ReceptionistRepository;
import org.springframework.stereotype.Service;
import com.vitalcare.backend.dto.PatientResponse;
import com.vitalcare.backend.entity.Patient;
import java.util.List;

import java.time.LocalDate;

@Service
public class AdminService {

        private final PatientRepository patientRepository;
        private final DoctorRepository doctorRepository;
        private final ReceptionistRepository receptionistRepository;
        private final DepartmentRepository departmentRepository;
        private final AppointmentRepository appointmentRepository;

        public AdminService(
                        PatientRepository patientRepository,
                        DoctorRepository doctorRepository,
                        ReceptionistRepository receptionistRepository,
                        DepartmentRepository departmentRepository,
                        AppointmentRepository appointmentRepository) {
                this.patientRepository = patientRepository;

                this.doctorRepository = doctorRepository;

                this.receptionistRepository = receptionistRepository;

                this.departmentRepository = departmentRepository;

                this.appointmentRepository = appointmentRepository;
        }

        public AdminDashboardStatsResponse getDashboardStats() {

                long totalPatients = patientRepository.count();

                long totalDoctors = doctorRepository.count();

                long totalReceptionists = receptionistRepository.count();

                long totalDepartments = departmentRepository.count();

                long todayAppointments = appointmentRepository
                                .countByAppointmentDate(
                                                LocalDate.now());

                long bookedAppointments = appointmentRepository
                                .countByAppointmentStatus(
                                                AppointmentStatus.BOOKED);

                long completedAppointments = appointmentRepository
                                .countByAppointmentStatus(
                                                AppointmentStatus.COMPLETED);

                long cancelledAppointments = appointmentRepository
                                .countByAppointmentStatus(
                                                AppointmentStatus.CANCELLED);

                return new AdminDashboardStatsResponse(
                                totalPatients,
                                totalDoctors,
                                totalReceptionists,
                                totalDepartments,
                                todayAppointments,
                                bookedAppointments,
                                completedAppointments,
                                cancelledAppointments);
        }

        public List<PatientResponse> getAllPatients() {

                return patientRepository
                                .findAll()
                                .stream()
                                .map(this::convertPatientToResponse)
                                .toList();
        }

        private PatientResponse convertPatientToResponse(
                        Patient patient) {

                String dateOfBirth = patient.getDateOfBirth() != null
                                ? patient.getDateOfBirth().toString()
                                : null;

                return new PatientResponse(
                                patient.getPatientId(),
                                patient.getFullName(),
                                patient.getUser().getEmail(),
                                dateOfBirth,
                                patient.getGender(),
                                patient.getPhone(),
                                patient.getAddress());
        }
}