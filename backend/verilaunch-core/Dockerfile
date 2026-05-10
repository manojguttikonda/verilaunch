# --- Build Stage ---
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven && \
    mvn clean package -DskipTests --no-transfer-progress

# --- Runtime Stage ---
FROM eclipse-temurin:21-jre-alpine AS runtime
LABEL maintainer="VeriLaunch Platform Team"
LABEL org.opencontainers.image.title="verilaunch-core"
LABEL org.opencontainers.image.description="VeriLaunch Core Backend Service"

# Security: run as non-root
RUN addgroup -S verilaunch && adduser -S verilaunch -G verilaunch
USER verilaunch

WORKDIR /app

COPY --from=builder /build/target/verilaunch-core-*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-Xms256m -Xmx512m -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
