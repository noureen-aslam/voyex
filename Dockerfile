# STAGE 1: Build the Java application
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only pom.xml first for caching
COPY backend/pom.xml .
RUN mvn dependency:go-offline

# Copy the source code
COPY backend/src ./src

# Build the WAR file
RUN mvn clean package -DskipTests

# STAGE 2: Run in Tomcat
FROM tomcat:10.1-jdk17-temurin
RUN rm -rf /usr/local/tomcat/webapps/*

# These variables will be pulled from Render's dashboard at runtime
ENV DB_URL=${DB_URL}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}

# Copy the built WAR into Tomcat as ROOT.war to serve from the base URL
COPY --from=build /app/target/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]