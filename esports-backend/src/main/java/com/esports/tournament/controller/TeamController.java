package com.esports.tournament.controller;

import com.esports.tournament.entity.Team;
import com.esports.tournament.entity.Tournament;
import com.esports.tournament.entity.User;
import com.esports.tournament.repository.TeamRepository;
import com.esports.tournament.repository.TournamentRepository;
import com.esports.tournament.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "http://localhost:3000")
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private UserRepository userRepository;

    // ===== REGISTER TEAM FOR TOURNAMENT =====
    @PostMapping("/register")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<?> registerTeam(@RequestBody Map<String, Object> request,
                                           Authentication authentication) {
        User captain = userRepository.findByEmail(authentication.getName()).orElseThrow();

        Long tournamentId = Long.valueOf(request.get("tournamentId").toString());
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        Team team = new Team();
        team.setTeamName((String) request.get("teamName"));
        team.setTeamTag((String) request.get("teamTag"));
        team.setCaptain(captain);
        team.setTournament(tournament);
        team.setStatus(Team.TeamStatus.REGISTERED);

        teamRepository.save(team);
        return ResponseEntity.ok(Map.of("message", "Team registered successfully! Waiting for approval."));
    }

    // ===== GET TEAMS BY TOURNAMENT =====
    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<List<Team>> getTeamsByTournament(@PathVariable Long tournamentId) {
        return ResponseEntity.ok(teamRepository.findByTournamentId(tournamentId));
    }

    // ===== APPROVE TEAM (Organizer/Admin) =====
    @PutMapping("/{teamId}/approve")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> approveTeam(@PathVariable Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        team.setStatus(Team.TeamStatus.APPROVED);
        teamRepository.save(team);
        return ResponseEntity.ok(Map.of("message", "Team approved!"));
    }

    // ===== UPDATE SCORE =====
    @PutMapping("/{teamId}/score")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> updateScore(@PathVariable Long teamId,
                                          @RequestBody Map<String, Integer> request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        team.setPoints(request.get("points"));
        team.setWins(request.get("wins"));
        team.setLosses(request.get("losses"));
        teamRepository.save(team);
        return ResponseEntity.ok(Map.of("message", "Score updated!"));
    }

    // ===== MY TEAMS =====
    @GetMapping("/my-teams")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<List<Team>> getMyTeams(Authentication authentication) {
        User captain = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(teamRepository.findByCaptainId(captain.getId()));
    }
}
