FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
COPY frontend ./frontend
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY eslint.config.js ./
RUN npm ci
RUN npm run build

FROM maven:3.9.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY backend/pom.xml ./backend/pom.xml
COPY backend/src ./backend/src
RUN mvn -f backend/pom.xml -q -DskipTests package

FROM tomcat:10.1-jdk17-temurin
ENV FRONTEND_DIST_DIR=/usr/local/tomcat/frontend-dist
ENV DB_URL=jdbc:mysql://localhost:3306/voyex?useSSL=false&serverTimezone=UTC
ENV DB_USERNAME=root
ENV DB_PASSWORD=

COPY --from=frontend-build /app/dist ${FRONTEND_DIST_DIR}
COPY --from=backend-build /app/backend/target/ROOT.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]
