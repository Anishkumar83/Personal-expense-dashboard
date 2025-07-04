# Use Java 21 base image
FROM eclipse-temurin:21-jdk-alpine

# Set working directory inside container
WORKDIR /app

# Copy everything from your project into the container
COPY . .

# Run Maven build using wrapper
RUN ./mvnw clean package -DskipTests

# Run the Spring Boot app
CMD ["java", "-jar", "target/Personal-Expense-Tracker-0.0.1-SNAPSHOT.jar"]
