# STAGE 1: Build the Java application
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only pom.xml first (better caching)
COPY backend/pom.xml .
RUN mvn dependency:go-offline

# Copy the source code
COPY backend/src ./src

# Build the WAR file
RUN mvn clean package -DskipTests

# STAGE 2: Run in Tomcat
FROM tomcat:10.1-jdk17-temurin
RUN rm -rf /usr/local/tomcat/webapps/*

# Environment variables for DB (set securely in Render dashboard)
ENV DB_URL=jdbc:mysql://localhost:3306/voyex?useSSL=false&serverTimezone=UTC
ENV DB_USERNAME=root
ENV DB_PASSWORD=

# Copy the built WAR into Tomcat
COPY --from=build /app/target/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]
