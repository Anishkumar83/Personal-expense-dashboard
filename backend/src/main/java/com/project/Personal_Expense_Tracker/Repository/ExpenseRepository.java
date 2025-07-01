package com.project.Personal_Expense_Tracker.Repository;

import com.project.Personal_Expense_Tracker.Entity.Expense;
import com.project.Personal_Expense_Tracker.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense,Long> {
    List<Expense> findByUsers(Users user);
}
