package com.project.Personal_Expense_Tracker.Service;

import com.project.Personal_Expense_Tracker.DTO.ExpenseRequest;
import com.project.Personal_Expense_Tracker.DTO.ExpenseResponse;
import com.project.Personal_Expense_Tracker.Entity.Expense;
import com.project.Personal_Expense_Tracker.Entity.Users;
import com.project.Personal_Expense_Tracker.Repository.ExpenseRepository;
import com.project.Personal_Expense_Tracker.Repository.UserDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserDetailsRepository usersRepository;

    @Override
    public ExpenseResponse addExpense(ExpenseRequest request, String username) {
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setUsers(user);

        Expense saved = expenseRepository.save(expense);

        return toDto(saved);
    }

    @Override
    public List<ExpenseResponse> getAllExpenses(String username) {
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Expense> expenses = expenseRepository.findByUsers(user);

        return expenses.stream().map(this::toDto).toList();
    }

    @Override
    public ExpenseResponse getExpenseById(Long id, String username) {
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = expenseRepository.findById(id)
                .filter(e -> e.getUsers().getUsername().equals(username))
                .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized"));

        return toDto(expense);
    }

    @Override
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, String username) {
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = expenseRepository.findById(id)
                .filter(e -> e.getUsers().getUsername().equals(username))
                .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized"));

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());

        Expense updated = expenseRepository.save(expense);

        return toDto(updated);
    }

    @Override
    public void deleteExpense(Long id, String username) {
        Expense expense = expenseRepository.findById(id)
                .filter(e -> e.getUsers().getUsername().equals(username))
                .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized"));

        expenseRepository.delete(expense);
    }

    private ExpenseResponse toDto(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDate(),
                expense.getUsers().getUsername()
        );
    }
}
