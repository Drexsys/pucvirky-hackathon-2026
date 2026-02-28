package org.hackathon2026.backend.controllers;

import org.hackathon2026.backend.models.User;
import org.hackathon2026.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<String> registerUser(
            @RequestParam String username,
            @RequestParam String password
    ) {
        User user = userRepository.findByUsernameAndPasswordHash(username, password.hashCode());
        if (user == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong username or password");

        return ResponseEntity.ok("");
    }

    @PostMapping
    public ResponseEntity<String> loginUser(
            @RequestParam String username,
            @RequestParam String password
    ) {
        if (userRepository.count() > 0)
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");

        userRepository.save(new User(username, password));
        return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully");
    }

    @GetMapping("/count")
    public Integer getCount() {
        return (int) userRepository.count();
    }

}
