FROM gradle:8.5-jdk17 AS builder
WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

RUN chmod +x ./gradlew
RUN ./gradlew clean war

FROM tomcat:10.0-jdk17-openjdk-slim
COPY --from=builder /app/build/libs/*.war /usr/local/tomcat/webapps/api.war
EXPOSE 8080
CMD ["catalina.sh", "run"]