package com.iset.hobbyapp.repository;

import com.iset.hobbyapp.entity.Hobby;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HobbyRepository extends JpaRepository<Hobby, Long> {
}