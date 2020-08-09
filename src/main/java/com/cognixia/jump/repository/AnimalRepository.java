package com.cognixia.jump.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cognixia.jump.model.Animal;

// mark/label this as a repo
@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {

	// one of the methods listed in jpa, retrieve all the records/entities from a table
	List<Animal> findAll();
	
}
