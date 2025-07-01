package com.project.Personal_Expense_Tracker.Controller;

import com.project.Personal_Expense_Tracker.DTO.ExpenseRequest;
import com.project.Personal_Expense_Tracker.DTO.ExpenseResponse;
import com.project.Personal_Expense_Tracker.Entity.Expense;
import com.project.Personal_Expense_Tracker.Service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(
            @RequestBody ExpenseRequest request,
            Principal principal
    ) {
        String username = principal.getName();
        ExpenseResponse response = expenseService.addExpense(request, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses(Principal principal) {
        String username = principal.getName();
        List<ExpenseResponse> expenses = expenseService.getAllExpenses(username);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id, Principal principal) {
        String username = principal.getName();
        ExpenseResponse expense = expenseService.getExpenseById(id, username);
        return ResponseEntity.ok(expense);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @RequestBody ExpenseRequest request,
            Principal principal
    ) {
        String username = principal.getName();
        ExpenseResponse updated = expenseService.updateExpense(id, request, username);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id, Principal principal) {
        String username = principal.getName();
        expenseService.deleteExpense(id, username);
        return ResponseEntity.ok("Expense deleted successfully");
    }


}
