package com.project.Personal_Expense_Tracker.Service;

import com.project.Personal_Expense_Tracker.DTO.ExpenseRequest;
import com.project.Personal_Expense_Tracker.DTO.ExpenseResponse;

import java.util.List;


public interface ExpenseService {

    ExpenseResponse addExpense(ExpenseRequest request, String username);

    List<ExpenseResponse> getAllExpenses(String username);

    ExpenseResponse getExpenseById(Long id, String username);

    ExpenseResponse updateExpense(Long id, ExpenseRequest request, String username);

    void deleteExpense(Long id, String username);


}
