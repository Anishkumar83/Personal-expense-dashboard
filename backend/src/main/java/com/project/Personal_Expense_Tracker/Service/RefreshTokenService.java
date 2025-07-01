package com.project.Personal_Expense_Tracker.Service;

import com.project.Personal_Expense_Tracker.Entity.RefreshToken;
import com.project.Personal_Expense_Tracker.Entity.Users;
import com.project.Personal_Expense_Tracker.Repository.RefreshTokenRepository;
import com.project.Personal_Expense_Tracker.Repository.UserDetailsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${jwt.refreshExpirationMs}")
    private Long refreshTokenDurationMs;

    @Autowired
    private final RefreshTokenRepository refreshTokenRepo;
    @Autowired
    private final UserDetailsRepository userRepo;


    @Transactional
    public RefreshToken createRefreshToken(Users user) {
        refreshTokenRepo.deleteByUser(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .build();

        try {
            return refreshTokenRepo.save(refreshToken);
        } catch (Exception e) {
            System.err.println("Refresh token save error: " + e.getMessage());
            throw e;
        }
    }


    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepo.delete(token);
            throw new RuntimeException("Refresh token expired. Please login again.");
        }
        return token;
    }

    @Transactional
    public void deleteByUserId(Long userId) {
        userRepo.findById(userId).ifPresent(refreshTokenRepo::deleteByUser);
    }

    public Optional<RefreshToken> getToken(String token) {
        return refreshTokenRepo.findByToken(token);
    }

}
