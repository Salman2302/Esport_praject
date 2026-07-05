package com.esports.tournament.controller;

import com.esports.tournament.entity.User;
import com.esports.tournament.repository.MatchRepository;
import com.esports.tournament.repository.TeamRepository;
import com.esports.tournament.repository.TournamentRepository;
import com.esports.tournament.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private MatchRepository matchRepository;

    // ===== DASHBOARD STATS =====
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalTournaments", tournamentRepository.count());
        stats.put("totalTeams", teamRepository.count());
        stats.put("totalMatches", matchRepository.count());
        stats.put("liveMatches", matchRepository.findByStatus(
                com.esports.tournament.entity.Match.MatchStatus.LIVE).size());
        return ResponseEntity.ok(stats);
    }

    // ===== GET ALL USERS =====
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // ===== DEACTIVATE USER =====
    @PutMapping("/users/{userId}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User deactivated!"));
    }

    // ===== CHANGE USER ROLE =====
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> changeRole(@PathVariable Long userId,
                                         @RequestBody Map<String, String> request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(User.Role.valueOf(request.get("role")));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Role updated!"));
    }
}
