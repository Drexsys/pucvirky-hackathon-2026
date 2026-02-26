package org.hackathon2026.backend.repositories;

import org.hackathon2026.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsernameAndPasswordHash(String username, Integer passwordHash);
    boolean existsByUsername(String username);
}
