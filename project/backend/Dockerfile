# Build Stage
FROM maven:3.8.5-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

# Run Stage
FROM tomcat:10.1-jdk17-onbuild
# Remove default Tomcat apps
RUN rm -rf /usr/local/tomcat/webapps/*
# Copy your war file as ROOT.war so it serves at /
COPY --from=build /target/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]