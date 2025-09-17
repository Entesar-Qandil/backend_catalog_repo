package com.example.catalog.favorite;

import com.example.catalog.favorite.dto.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class FavoriteService {
  private final FavoriteRepository repo;
  public FavoriteService(FavoriteRepository repo) { this.repo = repo; }

  public FavoriteResponse create(CreateFavoriteRequest req) {
    var existing = repo.findByCatId(req.catId());
    if (existing.isPresent()) return FavoriteResponse.from(existing.get());
    var f = new Favorite();
    f.setCatId(req.catId());
    f.setNote(req.note());
    return FavoriteResponse.from(repo.save(f));
  }

  public List<FavoriteResponse> list() {
    return repo.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream().map(FavoriteResponse::from).toList();
  }

  public FavoriteResponse get(Long id) {
    return FavoriteResponse.from(repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
  }

  public FavoriteResponse update(Long id, UpdateFavoriteRequest req) {
    var f = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    f.setNote(req.note());
    return FavoriteResponse.from(repo.save(f));
  }

  public void delete(Long id) {
    if (!repo.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    repo.deleteById(id);
  }
}
