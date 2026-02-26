package org.hackathon2026.backend.models;

import jakarta.persistence.*;
import org.hibernate.validator.constraints.UniqueElements;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(unique = true)
    private String  username;
    private int passwordHash;

    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.passwordHash = password.hashCode();
    }

    public int getPasswordHash() {
        return passwordHash;
    }

    public String getUsername() {
        return username;
    }
}
