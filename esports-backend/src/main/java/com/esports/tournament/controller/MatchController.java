package com.esports.tournament.controller;

import com.esports.tournament.entity.Match;
import com.esports.tournament.entity.Team;
import com.esports.tournament.entity.Tournament;
import com.esports.tournament.repository.MatchRepository;
import com.esports.tournament.repository.TeamRepository;
import com.esports.tournament.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "http://localhost:3000")
public class MatchController {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private TeamRepository teamRepository;

    // ===== SCHEDULE MATCH =====
    @PostMapping("/schedule")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> scheduleMatch(@RequestBody Map<String, Object> request) {
        Long tournamentId = Long.valueOf(request.get("tournamentId").toString());
        Long team1Id = Long.valueOf(request.get("team1Id").toString());
        Long team2Id = Long.valueOf(request.get("team2Id").toString());

        Tournament tournament = tournamentRepository.findById(tournamentId).orElseThrow();
        Team team1 = teamRepository.findById(team1Id).orElseThrow();
        Team team2 = teamRepository.findById(team2Id).orElseThrow();

        Match match = new Match();
        match.setTournament(tournament);
        match.setTeam1(team1);
        match.setTeam2(team2);
        match.setRound((String) request.get("round"));
        match.setMatchType((String) request.getOrDefault("matchType", "BO1"));
        match.setStreamUrl((String) request.get("streamUrl"));
        match.setStatus(Match.MatchStatus.SCHEDULED);

        matchRepository.save(match);
        return ResponseEntity.ok(Map.of("message", "Match scheduled!"));
    }

    // ===== GET MATCHES BY TOURNAMENT =====
    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<List<Match>> getMatchesByTournament(@PathVariable Long tournamentId) {
        return ResponseEntity.ok(matchRepository.findByTournamentId(tournamentId));
    }

    // ===== GET LIVE MATCHES =====
    @GetMapping("/live")
    public ResponseEntity<List<Match>> getLiveMatches() {
        return ResponseEntity.ok(matchRepository.findByStatus(Match.MatchStatus.LIVE));
    }

    // ===== UPDATE MATCH RESULT =====
    @PutMapping("/{matchId}/result")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> updateResult(@PathVariable Long matchId,
                                           @RequestBody Map<String, Object> request) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        match.setTeam1Score((Integer) request.get("team1Score"));
        match.setTeam2Score((Integer) request.get("team2Score"));
        match.setStatus(Match.MatchStatus.COMPLETED);
        match.setCompletedAt(LocalDateTime.now());

        Long winnerId = Long.valueOf(request.get("winnerId").toString());
        Team winner = teamRepository.findById(winnerId).orElseThrow();
        match.setWinner(winner);

        matchRepository.save(match);
        return ResponseEntity.ok(Map.of("message", "Match result updated!"));
    }

    // ===== GO LIVE =====
    @PutMapping("/{matchId}/go-live")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<?> goLive(@PathVariable Long matchId) {
        Match match = matchRepository.findById(matchId).orElseThrow();
        match.setStatus(Match.MatchStatus.LIVE);
        matchRepository.save(match);
        return ResponseEntity.ok(Map.of("message", "Match is now LIVE!"));
    }
}
