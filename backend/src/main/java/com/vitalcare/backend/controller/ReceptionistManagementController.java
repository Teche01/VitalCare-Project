package com.vitalcare.backend.controller;

import com.vitalcare.backend.dto.ReceptionistRequest;
import com.vitalcare.backend.dto.ReceptionistResponse;
import com.vitalcare.backend.service.ReceptionistManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(
        "/api/admin/receptionists"
)
@CrossOrigin(
        origins = "http://localhost:5173"
)
public class ReceptionistManagementController {

    private final ReceptionistManagementService
            receptionistManagementService;

    public ReceptionistManagementController(
            ReceptionistManagementService receptionistManagementService
    ) {
        this.receptionistManagementService =
                receptionistManagementService;
    }

    @PostMapping
    public ResponseEntity<ReceptionistResponse>
            createReceptionist(
                    @Valid
                    @RequestBody
                    ReceptionistRequest request
            ) {

        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        receptionistManagementService
                                .createReceptionist(
                                        request
                                )
                );
    }

    @GetMapping
    public List<ReceptionistResponse>
            getAllReceptionists() {

        return receptionistManagementService
                .getAllReceptionists();
    }

    @PatchMapping(
            "/{receptionistId}/status"
    )
    public ReceptionistResponse
            changeReceptionistStatus(
                    @PathVariable
                    Integer receptionistId,

                    @RequestParam
                    Boolean active
            ) {

        return receptionistManagementService
                .changeReceptionistStatus(
                        receptionistId,
                        active
                );
    }
}