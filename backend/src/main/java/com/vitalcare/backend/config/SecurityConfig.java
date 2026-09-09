package com.vitalcare.backend.config;

import com.vitalcare.backend.security.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(
                        JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                http
                                .csrf(
                                                csrf -> csrf.disable())

                                .cors(
                                                Customizer.withDefaults())

                                .sessionManagement(
                                                session -> session.sessionCreationPolicy(
                                                                SessionCreationPolicy.STATELESS))

                                .formLogin(
                                                form -> form.disable())

                                .httpBasic(
                                                basic -> basic.disable())

                                .exceptionHandling(
                                                exception -> exception
                                                                .authenticationEntryPoint(
                                                                                (
                                                                                                request,
                                                                                                response,
                                                                                                authException) -> response
                                                                                                                .sendError(
                                                                                                                                HttpServletResponse.SC_UNAUTHORIZED))

                                                                .accessDeniedHandler(
                                                                                (
                                                                                                request,
                                                                                                response,
                                                                                                accessDeniedException) -> response
                                                                                                                .sendError(
                                                                                                                                HttpServletResponse.SC_FORBIDDEN)))

                                .authorizeHttpRequests(
                                                auth -> auth

                                                                // =========================
                                                                // CORS / ERRORS
                                                                // =========================

                                                                .requestMatchers(
                                                                                HttpMethod.OPTIONS,
                                                                                "/**")
                                                                .permitAll()

                                                                .requestMatchers(
                                                                                "/error")
                                                                .permitAll()

                                                                // =========================
                                                                // PUBLIC AUTH
                                                                // =========================

                                                                .requestMatchers(
                                                                                HttpMethod.POST,
                                                                                "/api/auth/login",
                                                                                "/api/auth/register/patient",
                                                                                "/api/auth/setup-admin")
                                                                .permitAll()

                                                                // =========================
                                                                // ADMIN
                                                                // =========================

                                                                .requestMatchers(
                                                                                "/api/admin/**")
                                                                .hasRole(
                                                                                "ADMIN")

                                                                // =========================
                                                                // RECEPTIONIST
                                                                // =========================

                                                                .requestMatchers(
                                                                                "/api/receptionist/**")
                                                                .hasRole(
                                                                                "RECEPTIONIST")

                                                                // =========================
                                                                // DOCTOR CONSULTATION
                                                                // =========================

                                                                .requestMatchers(
                                                                                HttpMethod.GET,
                                                                                "/api/consultations/doctor/**")
                                                                .hasRole(
                                                                                "DOCTOR")

                                                                .requestMatchers(
                                                                                HttpMethod.POST,
                                                                                "/api/consultations/prescriptions")
                                                                .hasRole(
                                                                                "DOCTOR")

                                                                // =========================
                                                                // PATIENT PRESCRIPTIONS
                                                                // =========================

                                                                .requestMatchers(
                                                                                HttpMethod.GET,
                                                                                "/api/consultations/prescriptions/patient/**")
                                                                .hasRole(
                                                                                "PATIENT")

                                                                .requestMatchers(
                                                                                HttpMethod.GET,
                                                                                "/api/consultations/prescriptions/appointment/**")
                                                                .hasAnyRole(
                                                                                "PATIENT",
                                                                                "DOCTOR")

                                                                // =========================
                                                                // APPOINTMENTS
                                                                // =========================

                                                                .requestMatchers(
                                                                                "/api/appointments/**")
                                                                .hasRole(
                                                                                "PATIENT")

                                                                // =========================
                                                                // DEPARTMENTS
                                                                // =========================

                                                                .requestMatchers(
                                                                                HttpMethod.GET,
                                                                                "/api/departments/**")
                                                                .hasAnyRole(
                                                                                "PATIENT",
                                                                                "ADMIN")

                                                                .requestMatchers(
                                                                                "/api/departments/**")
                                                                .hasRole(
                                                                                "ADMIN")

                                                                // =========================
                                                                // DOCTORS
                                                                // =========================

                                                                .requestMatchers(
                                                                                HttpMethod.GET,
                                                                                "/api/doctors/**")
                                                                .hasAnyRole(
                                                                                "PATIENT",
                                                                                "ADMIN")

                                                                .requestMatchers(
                                                                                "/api/doctors/**")
                                                                .hasRole(
                                                                                "ADMIN")

                                                                // =========================
                                                                // DOCTOR SLOT VIEWING
                                                                // =========================

                                                                .requestMatchers(
                                                                                HttpMethod.GET,
                                                                                "/api/doctor-availability/doctor/*/slots")
                                                                .hasRole(
                                                                                "PATIENT")

                                                                .requestMatchers(
                                                                                "/api/patients/**")
                                                                .hasRole(
                                                                                "PATIENT")

                                                                // =========================
                                                                // AVAILABILITY MANAGEMENT
                                                                // =========================

                                                                .requestMatchers(
                                                                                "/api/doctor-availability/**")
                                                                .hasRole(
                                                                                "ADMIN")

                                                                // =========================
                                                                // EVERYTHING ELSE
                                                                // =========================

                                                                .anyRequest()
                                                                .authenticated())

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(
                                List.of(
                                                "http://localhost:5173"));

                configuration.setAllowedMethods(
                                List.of(
                                                "GET",
                                                "POST",
                                                "PUT",
                                                "PATCH",
                                                "DELETE",
                                                "OPTIONS"));

                configuration.setAllowedHeaders(
                                List.of(
                                                "Authorization",
                                                "Content-Type"));

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration(
                                "/**",
                                configuration);

                return source;
        }
}