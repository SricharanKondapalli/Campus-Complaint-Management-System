package com.campus.campusresourcemanagement.controller;

import com.campus.campusresourcemanagement.entity.Complaint;
import com.campus.campusresourcemanagement.entity.User;
import com.campus.campusresourcemanagement.repository.UserRepository;
import com.campus.campusresourcemanagement.service.ComplaintService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class ComplaintController {

    private final ComplaintService complaintService;
    private final UserRepository userRepository;

    public ComplaintController(
            ComplaintService complaintService,
            UserRepository userRepository) {

        this.complaintService = complaintService;
        this.userRepository = userRepository;
    }

    @PostMapping("/complaints")
    public Complaint createComplaint(
            @RequestBody Complaint complaint,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        complaint.setUser(user);

        return complaintService.createComplaint(complaint);
    }

    @GetMapping("/complaints")
    public List<Complaint> getAllComplaints(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("ADMIN".equals(user.getRole())) {
            return complaintService.getAllComplaints();
        }

        return complaintService.getComplaintsByUser(user);
    }

    @GetMapping("/complaints/{id}")
    public Optional<Complaint> getComplaintById(@PathVariable Long id) {
        return complaintService.getComplaintById(id);
    }

    @DeleteMapping("/complaints/{id}")
    public void deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
    }

    @PutMapping("/complaints/{id}")
    public Complaint updateComplaint(
            @PathVariable Long id,
            @RequestBody Complaint complaint) {

        return complaintService.updateComplaint(id, complaint);
    }

    @PatchMapping("/complaints/{id}/status")
    public Complaint updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return complaintService.updateStatus(id, status);
    }
}