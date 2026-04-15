# 1. Build the Java Backend
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
# Only copy the backend files (replace 'backend' with your actual folder name if needed)
COPY . . 
RUN mvn clean package -DskipTests

# 2. Run in Tomcat
FROM tomcat:10.1-jdk17-temurin
RUN rm -rf /usr/local/tomcat/webapps/*
# Adjust 'target/*.war' if your war has a specific name
COPY --from=build /app/target/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]