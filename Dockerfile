FROM tomcat:10.0-jdk17-openjdk-slim

# Set working directory
WORKDIR /app

# Copy the WAR file
COPY build/libs/*.war /usr/local/tomcat/webapps/api.war

# Expose the default Tomcat port
EXPOSE 8080

# Start Tomcat (this is the default behavior of the Tomcat image)
CMD ["catalina.sh", "run"]
