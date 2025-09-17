package com.example.catalog.favorite.dto;

import com.example.catalog.favorite.Favorite;
import java.time.Instant;

public record FavoriteResponse(Long id, String catId, String note, Instant createdAt) {
  public static FavoriteResponse from(Favorite f) {
    return new FavoriteResponse(f.getId(), f.getCatId(), f.getNote(), f.getCreatedAt());
  }
}
