package com.project.Personal_Expense_Tracker;

import com.project.Personal_Expense_Tracker.Config.DotenvInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PersonalExpenseTrackerApplication {

	public static void main(String[] args) {
		DotenvInitializer.init();
		SpringApplication.run(PersonalExpenseTrackerApplication.class, args);
	}

}
