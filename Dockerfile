# 🛠️ Build Stage
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app

COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN gradle war

# 🚀 Runtime Stage with Tomcat
FROM tomcat:11.0.6-jdk17
ENV CATALINA_OPTS="-Djava.util.logging.ConsoleHandler.level=FINE -Dorg.apache.catalina.startup.ContextConfig.level=FINE -Dorg.apache.catalina.core.ContainerBase.[Catalina].[localhost].level=FINE"

RUN rm -rf /usr/local/tomcat/webapps/*

COPY --from=builder /app/build/libs/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080