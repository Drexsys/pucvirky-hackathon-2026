#FROM eclipse-temurin:17
#ARG JAR_FILE=target/*.jar
#COPY ${JAR_FILE} app.jar
#ENTRYPOINT ["java","-jar","/app.jar"]

# ---- build stage ----
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /workspace

# Спочатку копіюємо тільки pom.xml (та .mvn/ якщо є) для кешування залежностей
COPY pom.xml .
# Якщо використовуєш Maven Wrapper, розкоментуй:
# COPY .mvn/ .mvn/
# COPY mvnw .

RUN mvn -B -q -DskipTests dependency:go-offline

# Тепер копіюємо вихідний код і збираємо
COPY src ./src
RUN mvn -B -DskipTests package

# ---- runtime stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]