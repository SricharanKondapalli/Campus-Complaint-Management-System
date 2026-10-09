
package com.campus.campusresourcemanagement.controller;

import com.campus.campusresourcemanagement.dto.LoginRequest;
import com.campus.campusresourcemanagement.entity.User;
import com.campus.campusresourcemanagement.repository.UserRepository;
import com.campus.campusresourcemanagement.security.JwtService;
import com.campus.campusresourcemanagement.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        user.setRole("STUDENT");
        return userService.createUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );
    }
}
