package com.example.catalog.favorite;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
  Optional<Favorite> findByCatId(String catId);
}
