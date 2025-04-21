# 🛠️ Build Stage
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

RUN chmod +x ./gradlew
RUN ./gradlew clean war

# 🚀 Runtime Stage with Tomcat
FROM tomcat:10.0-jdk17-openjdk-slim

# Clean default apps (optional, makes it cleaner)
RUN rm -rf /usr/local/tomcat/webapps/*

COPY --from=builder /app/build/libs/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080