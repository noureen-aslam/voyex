# STAGE 1: Build the Java application
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy everything so we have the 'project/backend' structure
COPY . .

# Move to where the pom.xml is
WORKDIR /app/project/backend

# Build the WAR file
RUN mvn clean package -DskipTests

# STAGE 2: Run in Tomcat
FROM tomcat:10.1-jdk17-temurin
RUN rm -rf /usr/local/tomcat/webapps/*

# Environment variables for your DB (Update these in Render Dashboard instead for security!)
ENV DB_URL=jdbc:mysql://localhost:3306/voyex?useSSL=false&serverTimezone=UTC
ENV DB_USERNAME=root
ENV DB_PASSWORD=

# Copy the built WAR from the specific path
COPY --from=build /app/project/backend/target/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]