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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsersByBuilding(@RequestParam(required = false) Long buildingId) {
        List<User> users = (buildingId != null)
                ? userRepository.findByBuildingId(buildingId)
                : userRepository.findAll();
        List<UserDTO> response = users.stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(response);
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
    public ResponseEntity<UserDTO> createUser(@RequestBody CreateUserDTO dto) {
        if ((dto.getEmail() == null || dto.getEmail().isBlank()) && (dto.getPhoneNumber() == null || dto.getPhoneNumber().isBlank())) {
            throw new RuntimeException("Email or phone number is required");
        }
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhoneNumber(dto.getPhoneNumber());
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(savedUser));
    }

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
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
}

