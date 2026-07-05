package com.esports.tournament.repository;

import com.esports.tournament.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    List<Tournament> findByStatus(Tournament.TournamentStatus status);
    List<Tournament> findByGame(String game);
    List<Tournament> findByOrganizerId(Long organizerId);
}
