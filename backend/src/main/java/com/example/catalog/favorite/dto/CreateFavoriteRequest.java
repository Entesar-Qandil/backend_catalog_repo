package com.example.catalog.favorite.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateFavoriteRequest(@NotBlank String catId, String note) {}
