package com.project.Personal_Expense_Tracker.Repository;

import com.project.Personal_Expense_Tracker.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDetailsRepository extends JpaRepository<Users,Long> {
    Optional<Users> findByUsername(String email);

    boolean existsByUsername(String username);
}
