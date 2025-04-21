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
FROM tomcat:11.0.6-jdk17

RUN rm -rf /usr/local/tomcat/webapps/*

COPY --from=builder /app/build/libs/*.war /usr/local/tomcat/webapps/api.war

EXPOSE 8080