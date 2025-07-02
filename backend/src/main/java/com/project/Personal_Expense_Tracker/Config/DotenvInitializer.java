package com.project.Personal_Expense_Tracker.Config;


import io.github.cdimascio.dotenv.Dotenv;

public class DotenvInitializer {
    public static void init() {
        Dotenv dotenv = Dotenv.load();

        dotenv.entries().forEach(entry -> {
            // Set each .env key-value as a system property
            System.setProperty(entry.getKey(), entry.getValue());
        });
    }
}

