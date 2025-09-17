package com.example.catalog.favorite;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "favorites", uniqueConstraints = @UniqueConstraint(columnNames = "cat_id"))
public class Favorite {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "cat_id", nullable = false)
  private String catId;

  private String note;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public String getCatId() { return catId; }
  public void setCatId(String catId) { this.catId = catId; }
  public String getNote() { return note; }
  public void setNote(String note) { this.note = note; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
