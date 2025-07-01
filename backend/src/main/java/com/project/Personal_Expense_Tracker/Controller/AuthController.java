package com.project.Personal_Expense_Tracker.Controller;

import com.project.Personal_Expense_Tracker.DTO.LoginRequest;
import com.project.Personal_Expense_Tracker.DTO.RegisterRequest;
import com.project.Personal_Expense_Tracker.Entity.RefreshToken;
import com.project.Personal_Expense_Tracker.Entity.Users;
import com.project.Personal_Expense_Tracker.Repository.UserDetailsRepository;
import com.project.Personal_Expense_Tracker.Service.RefreshTokenService;
import com.project.Personal_Expense_Tracker.Utility.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserDetailsRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtils;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        boolean exists = userRepo.existsByUsername(request.getUsername());
        if (exists) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }

        Users user = new Users(null, request.getUsername(), request.getEmail(),
                passwordEncoder.encode(request.getPassword()), "USER");

        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            Users user = (Users) authentication.getPrincipal();

            String accessToken = jwtUtils.generateToken(user);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

            return ResponseEntity.ok(Map.of(
                    "accessToken", accessToken,
                    "refreshToken", refreshToken.getToken()
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> requestMap) {
        String refreshToken = requestMap.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Refresh token missing"));
        }

        return refreshTokenService.getToken(refreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String newAccessToken = jwtUtils.generateToken(user);
                    return ResponseEntity.ok(Map.of(
                            "accessToken", newAccessToken,
                            "refreshToken", refreshToken
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(403).body(Map.of("error", "Invalid refresh token")));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        if (username == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username missing"));
        }

        return userRepo.findByUsername(username)
                .map(user -> {
                    refreshTokenService.deleteByUserId(user.getId());
                    return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
                })
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }
}
