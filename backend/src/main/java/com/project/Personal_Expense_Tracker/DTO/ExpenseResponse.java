package com.project.Personal_Expense_Tracker.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private String title;
    private Double amount;
    private String category;
    private LocalDate date;
    private String username;
}

