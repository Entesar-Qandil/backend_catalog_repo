package com.example.catalog.favorite;

import com.example.catalog.favorite.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
  private final FavoriteService svc;
  public FavoriteController(FavoriteService svc) { this.svc = svc; }

  @PostMapping
  public ResponseEntity<FavoriteResponse> create(@Valid @RequestBody CreateFavoriteRequest req) {
    return ResponseEntity.status(HttpStatus.CREATED).body(svc.create(req));
  }

  @GetMapping
  public List<FavoriteResponse> list() {
    return svc.list();
  }

  @GetMapping("/{id}")
  public FavoriteResponse get(@PathVariable Long id) {
    return svc.get(id);
  }

  @PutMapping("/{id}")
  public FavoriteResponse update(@PathVariable Long id, @RequestBody UpdateFavoriteRequest req) {
    return svc.update(id, req);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    svc.delete(id);
  }
}
