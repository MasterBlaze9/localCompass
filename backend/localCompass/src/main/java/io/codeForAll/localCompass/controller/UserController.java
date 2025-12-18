package io.codeForAll.localCompass.controller;

import io.codeForAll.localCompass.dto.user.CreateUserDTO;
import io.codeForAll.localCompass.dto.user.UserDTO;
import io.codeForAll.localCompass.entites.Building;
import io.codeForAll.localCompass.entites.User;
import io.codeForAll.localCompass.repositories.BuildingRepository;
import io.codeForAll.localCompass.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private UserRepository userRepository;
    BuildingRepository buildingRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setBuildingRepository(BuildingRepository buildingRepository) {
        this.buildingRepository = buildingRepository;
    }

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(username)
                .orElseGet(() -> userRepository.findByPhoneNumber(username)
                        .orElseThrow(() -> new RuntimeException("User not found")));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsersByBuilding(@RequestParam(required = false) Long buildingId) {
        // Admin can only view users from their own building; ignore provided buildingId
        User admin = getCurrentUser();
        if (admin.getBuilding() == null) {
            return ResponseEntity.ok(List.of());
        }
        Long adminBuildingId = admin.getBuilding().getId();
        List<User> users = userRepository.findByBuildingId(adminBuildingId);
        List<UserDTO> response = users.stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe() {
        return ResponseEntity.ok(new UserDTO(getCurrentUser()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new UserDTO(user));
    }

    @GetMapping("/by-email")
    public ResponseEntity<UserDTO> getUserByEmail(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new UserDTO(user));
    }

    @GetMapping("/by-phone")
    public ResponseEntity<UserDTO> getUserByPhone(@RequestParam String phoneNumber) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new UserDTO(user));
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserDTO dto) {
        if ((dto.getEmail() == null || dto.getEmail().isBlank()) && (dto.getPhoneNumber() == null || dto.getPhoneNumber().isBlank())) {
            throw new RuntimeException("Email or phone number is required");
        }

        // Check duplicates explicitly and return a structured 409 so frontend can map the correct field
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            String email = dto.getEmail().trim();
            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "This email is already registered", "field", "email", "code", "DUPLICATE_EMAIL"));
            }
        }

        if (dto.getPhoneNumber() != null && !dto.getPhoneNumber().isBlank()) {
            String phone = dto.getPhoneNumber().trim();
            if (userRepository.findByPhoneNumber(phone).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "This phone number is already registered", "field", "phoneNumber", "code", "DUPLICATE_PHONE"));
            }
        }

        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail() == null ? null : dto.getEmail().trim());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhoneNumber(dto.getPhoneNumber() == null ? null : dto.getPhoneNumber().trim());
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(savedUser));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/assign-building")
    public ResponseEntity<UserDTO> assignBuilding(@RequestBody io.codeForAll.localCompass.dto.user.AssignBuildingDTO dto) {
        Building building = buildingRepository.findBuildingById(dto.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Building not found"));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBuilding(building);
        if (dto.getUnitNumber() != null && !dto.getUnitNumber().isBlank()) {
            user.setUnitNumber(dto.getUnitNumber());
        }
        User saved = userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(saved));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<UserDTO> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Soft-remove from building: null building and unit
        user.setBuilding(null);
        user.setUnitNumber(null);
        User saved = userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(saved));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add-to-my-building")
    public ResponseEntity<UserDTO> addToMyBuilding(@RequestBody io.codeForAll.localCompass.dto.user.AddToMyBuildingDTO dto) {
        User admin = getCurrentUser();
        if (admin.getBuilding() == null) {
            throw new RuntimeException("Admin has no building assigned");
        }
        if ((dto.getEmail() == null || dto.getEmail().isBlank()) && (dto.getPhoneNumber() == null || dto.getPhoneNumber().isBlank())) {
            throw new RuntimeException("Email or phone is required");
        }
        User target = null;
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            target = userRepository.findByEmail(dto.getEmail()).orElse(null);
        }
        if (target == null && dto.getPhoneNumber() != null && !dto.getPhoneNumber().isBlank()) {
            target = userRepository.findByPhoneNumber(dto.getPhoneNumber()).orElse(null);
        }
        if (target == null) {
            throw new RuntimeException("User not found");
        }
        target.setBuilding(admin.getBuilding());
        if (dto.getUnitNumber() != null && !dto.getUnitNumber().isBlank()) {
            target.setUnitNumber(dto.getUnitNumber());
        }
        User saved = userRepository.save(target);
        return ResponseEntity.ok(new UserDTO(saved));
    }
}
