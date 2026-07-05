package com.esports.tournament.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tournaments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String game;          // e.g. "BGMI", "Valorant", "Free Fire"
    private String description;
    private String format;        // "Solo", "Duo", "Squad"

    private Integer maxTeams;
    private Integer prizePool;
    private String registrationFee;

    @Enumerated(EnumType.STRING)
    private TournamentStatus status = TournamentStatus.UPCOMING;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime registrationDeadline;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private User organizer;

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL)
    private List<Team> teams;

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL)
    private List<Match> matches;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public enum TournamentStatus {
        UPCOMING, REGISTRATION_OPEN, ONGOING, COMPLETED, CANCELLED
    }
}
