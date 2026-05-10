# --- Build Stage ---
# Use the official Maven image with Java 21 — no need to install Maven separately
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /build

# Cache dependencies layer separately for faster rebuilds
COPY pom.xml .
RUN mvn dependency:go-offline --no-transfer-progress -q

# Build the application
COPY src ./src
RUN mvn clean package -DskipTests --no-transfer-progress

# --- Runtime Stage ---
FROM eclipse-temurin:21-jre-alpine AS runtime
LABEL maintainer="VeriLaunch Platform Team"
LABEL org.opencontainers.image.title="verilaunch-core"
LABEL org.opencontainers.image.description="VeriLaunch Core Backend Service"

# Security: run as non-root user
RUN addgroup -S verilaunch && adduser -S verilaunch -G verilaunch
USER verilaunch

WORKDIR /app
COPY --from=builder /build/target/verilaunch-core-*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-Xms256m -Xmx512m -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
