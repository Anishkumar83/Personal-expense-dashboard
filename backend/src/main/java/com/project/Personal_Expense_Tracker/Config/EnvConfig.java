package com.project.Personal_Expense_Tracker.Config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Component;

@Component
public class EnvConfig {


    private final Dotenv dotenv = Dotenv.load();


    public String getDbUrl() {
        return dotenv.get("DB_URL");
    }


    public String getDbUsername() {
        return dotenv.get("DB_USERNAME");
    }


    public String getDbPassword() {
        return dotenv.get("DB_PASSWORD");
    }


    public String getJwtSecret() {
        return dotenv.get("JWT_SECRET");
    }


    public long getJwtExpiration() {
        return Long.parseLong(dotenv.get("JWT_EXPIRATION"));
    }


    public long getJwtRefreshExpiration() {
        return Long.parseLong(dotenv.get("JWT_REFRESH_EXPIRATION"));
    }
}

