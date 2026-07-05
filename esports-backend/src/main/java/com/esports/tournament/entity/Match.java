package com.esports.tournament.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @ManyToOne
    @JoinColumn(name = "team1_id")
    private Team team1;

    @ManyToOne
    @JoinColumn(name = "team2_id")
    private Team team2;

    @ManyToOne
    @JoinColumn(name = "winner_id")
    private Team winner;

    private Integer team1Score = 0;
    private Integer team2Score = 0;

    private String round;   // "Quarter Final", "Semi Final", "Final"
    private String matchType; // "BO1", "BO3", "BO5"

    @Enumerated(EnumType.STRING)
    private MatchStatus status = MatchStatus.SCHEDULED;

    private LocalDateTime scheduledAt;
    private LocalDateTime completedAt;

    private String streamUrl;   // YouTube/Twitch stream link

    public enum MatchStatus {
        SCHEDULED, LIVE, COMPLETED, CANCELLED
    }
}
