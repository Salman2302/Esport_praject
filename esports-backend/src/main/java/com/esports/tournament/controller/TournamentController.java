package com.esports.tournament.controller;

import com.esports.tournament.entity.Tournament;
import com.esports.tournament.entity.User;
import com.esports.tournament.repository.TournamentRepository;
import com.esports.tournament.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tournaments")
@CrossOrigin(origins = "http://localhost:3000")
public class TournamentController {

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private UserRepository userRepository;

    // ===== GET ALL TOURNAMENTS (Public) =====
    @GetMapping("/public/all")
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        return ResponseEntity.ok(tournamentRepository.findAll());
    }

    // ===== GET BY STATUS (Public) =====
    @GetMapping("/public/status/{status}")
    public ResponseEntity<List<Tournament>> getByStatus(@PathVariable String status) {
        Tournament.TournamentStatus tournamentStatus = Tournament.TournamentStatus.valueOf(status.toUpperCase());
        return ResponseEntity.ok(tournamentRepository.findByStatus(tournamentStatus));
    }

    // ===== GET BY GAME (Public) =====
    @GetMapping("/public/game/{game}")
    public ResponseEntity<List<Tournament>> getByGame(@PathVariable String game) {
        return ResponseEntity.ok(tournamentRepository.findByGame(game));
    }

    // ===== GET BY ID (Public) =====
    @GetMapping("/public/{id}")
    public ResponseEntity<?> getTournamentById(@PathVariable Long id) {
        return tournamentRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ===== CREATE TOURNAMENT (Organizer/Admin) =====
    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> createTournament(@RequestBody Map<String, Object> request,
                                               Authentication authentication) {
        User organizer = userRepository.findByEmail(authentication.getName())
                .orElseThrow();

        Tournament tournament = new Tournament();
        tournament.setName((String) request.get("name"));
        tournament.setGame((String) request.get("game"));
        tournament.setDescription((String) request.get("description"));
        tournament.setFormat((String) request.get("format"));
        tournament.setMaxTeams((Integer) request.get("maxTeams"));
        tournament.setPrizePool((Integer) request.get("prizePool"));
        tournament.setRegistrationFee((String) request.get("registrationFee"));
        tournament.setStatus(Tournament.TournamentStatus.UPCOMING);
        tournament.setOrganizer(organizer);

        Tournament saved = tournamentRepository.save(tournament);
        return ResponseEntity.ok(Map.of("message", "Tournament created!", "id", saved.getId()));
    }

    // ===== UPDATE STATUS (Organizer/Admin) =====
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                           @RequestBody Map<String, String> request) {
        Tournament tournament = tournamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        tournament.setStatus(Tournament.TournamentStatus.valueOf(request.get("status")));
        tournamentRepository.save(tournament);

        return ResponseEntity.ok(Map.of("message", "Status updated!"));
    }

    // ===== DELETE TOURNAMENT (Admin only) =====
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTournament(@PathVariable Long id) {
        tournamentRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Tournament deleted!"));
    }

    // ===== MY TOURNAMENTS (Organizer) =====
    @GetMapping("/my-tournaments")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<List<Tournament>> getMyTournaments(Authentication authentication) {
        User organizer = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(tournamentRepository.findByOrganizerId(organizer.getId()));
    }
}
