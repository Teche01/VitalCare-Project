package com.vitalcare.backend.service;

import com.vitalcare.backend.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms}")
    private long jwtExpiration;

    private SecretKey getSigningKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(
                        jwtSecret
                );

        return Keys.hmacShaKeyFor(
                keyBytes
        );
    }

    public String generateToken(
            User user
    ) {

        Date issuedAt =
                new Date();

        Date expiration =
                new Date(
                        System.currentTimeMillis()
                                + jwtExpiration
                );

        return Jwts.builder()
                .subject(
                        user.getEmail()
                )
                .claim(
                        "role",
                        user.getRole()
                                .name()
                )
                .issuedAt(
                        issuedAt
                )
                .expiration(
                        expiration
                )
                .signWith(
                        getSigningKey()
                )
                .compact();
    }

    public String extractEmail(
            String token
    ) {

        return extractClaims(token)
                .getSubject();
    }

    public String extractRole(
            String token
    ) {

        return extractClaims(token)
                .get(
                        "role",
                        String.class
                );
    }

    public boolean isTokenValid(
            String token,
            User user
    ) {

        Claims claims =
                extractClaims(token);

        String email =
                claims.getSubject();

        Date expiration =
                claims.getExpiration();

        return email.equals(
                user.getEmail()
        )
                && expiration.after(
                        new Date()
                )
                && Boolean.TRUE.equals(
                        user.getActive()
                );
    }

    private Claims extractClaims(
            String token
    ) {

        return Jwts.parser()
                .verifyWith(
                        getSigningKey()
                )
                .build()
                .parseSignedClaims(
                        token
                )
                .getPayload();
    }
}