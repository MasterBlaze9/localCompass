package io.codeForAll.localCompass.controller;

import io.codeForAll.localCompass.dto.user.CreateUserDTO;
import io.codeForAll.localCompass.dto.user.UserDTO;
import io.codeForAll.localCompass.entites.Building;
import io.codeForAll.localCompass.entites.User;
import io.codeForAll.localCompass.repositories.BuildingRepository;
import io.codeForAll.localCompass.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    BuildingRepository buildingRepository;

    // Get all users in a building
    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsersByBuilding(@RequestParam Long buildingId) {
        List<User> users = userRepository.findByBuildingId(buildingId);
        List<UserDTO> response = users.stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Get a single user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new UserDTO(user));
    }

    // Get a user by email
    @GetMapping("/by-email")
    public ResponseEntity<UserDTO> getUserByEmail(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new UserDTO(user));
    }

    // Get a user by phone number
    @GetMapping("/by-phone")
    public ResponseEntity<UserDTO> getUserByPhone(@RequestParam String phoneNumber) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new UserDTO(user));
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody CreateUserDTO dto) {
        // Find the building first
        Building building = buildingRepository.findByName(dto.getBuildingName())
                .orElseThrow(() -> new RuntimeException("Building not found"));

        // Create and populate the user entity
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); // Note: hash password in production!
        user.setUnitNumber(dto.getUnitNumber());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAdmin(dto.isAdmin());
        user.setBuilding(building);

        // Save to DB
        User savedUser = userRepository.save(user);

        // Return DTO response
        return ResponseEntity.ok(new UserDTO(savedUser));
    }
}

