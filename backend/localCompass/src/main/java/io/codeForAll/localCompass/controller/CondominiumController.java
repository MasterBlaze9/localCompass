package io.codeForAll.localCompass.controller;

import io.codeForAll.localCompass.dto.condominium.CondominiumDTO;
import io.codeForAll.localCompass.dto.condominium.CreateCondominiumDTO;
import io.codeForAll.localCompass.entites.Condominium;
import io.codeForAll.localCompass.repositories.CondominiumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/condominiums")
public class CondominiumController {

    @Autowired
    private CondominiumRepository condominiumRepository;

    // POST: Create a new Condominium
    @PostMapping
    public ResponseEntity<CondominiumDTO> createCondominium(@RequestBody CreateCondominiumDTO dto) {
        Condominium condominium = new Condominium();
        condominium.setName(dto.getName());
        condominium.setAddress(dto.getAddress());
        condominium.setAdminEmail(dto.getAdminEmail());

        Condominium savedCondominium = condominiumRepository.save(condominium);
        return ResponseEntity.ok(new CondominiumDTO(savedCondominium));
    }

    // GET: List all Condominiums
    @GetMapping
    public ResponseEntity<List<CondominiumDTO>> getAllCondominiums() {
        List<Condominium> condominiums = condominiumRepository.findAll();
        List<CondominiumDTO> dtoList = condominiums.stream()
                .map(CondominiumDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    // GET: Get a single Condominium by ID
    @GetMapping("/{id}")
    public ResponseEntity<CondominiumDTO> getCondominiumById(@PathVariable Long id) {
        Condominium condominium = condominiumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Condominium not found"));

        return ResponseEntity.ok(new CondominiumDTO(condominium));
    }
}

