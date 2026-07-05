package com.esports.tournament.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String teamName;

    private String teamTag;   // Short tag e.g. "TSM", "GEN"
    private String logoUrl;

    @ManyToOne
    @JoinColumn(name = "captain_id")
    private User captain;

    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @ManyToMany
    @JoinTable(
        name = "team_members",
        joinColumns = @JoinColumn(name = "team_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members;

    @Enumerated(EnumType.STRING)
    private TeamStatus status = TeamStatus.REGISTERED;

    private Integer wins = 0;
    private Integer losses = 0;
    private Integer points = 0;

    @Column(updatable = false)
    private LocalDateTime registeredAt;

    @PrePersist
    public void prePersist() {
        this.registeredAt = LocalDateTime.now();
    }

    public enum TeamStatus {
        REGISTERED, APPROVED, ELIMINATED, WINNER
    }
}
