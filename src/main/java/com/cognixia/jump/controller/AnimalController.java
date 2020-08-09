package com.cognixia.jump.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.cognixia.jump.model.Animal;
import com.cognixia.jump.repository.AnimalRepository;

@RequestMapping("/api")
@RestController
public class AnimalController {
	
	@Autowired
	AnimalRepository service;
	
	@GetMapping("/animals")
	public List<Animal> getAllAnimals() {
		  
		return service.findAll();
	} 
	
	@GetMapping("/animals/{id}")
	public Animal getAnimal(@PathVariable long id) {
		
		Optional<Animal> studentOpt = service.findById(id);
		 
		if(studentOpt.isPresent()) {
			return studentOpt.get();
		}
		 
		return new Animal();
	}
	
	@PostMapping("/add/animal")
	public void addAnimal(@RequestBody Animal newAnimal) {
		
		newAnimal.setId(-1L);
		
		Animal added = service.save(newAnimal); // save() does an insert or update (depends on id passed)
		
		System.out.println("Added: " + added);
		 
	}
	 
	@PutMapping("/update/animal")
	public @ResponseBody String updateAnimal(@RequestBody Animal updateAnimal) {
		
		// check if student exists, then update them
		
		Optional<Animal> found = service.findById(updateAnimal.getId());
		
		if(found.isPresent()) {
			service.save(updateAnimal);
			return "Saved: " + updateAnimal.toString();
		}
		else {
			return "Could not update student, the id = " + updateAnimal.getId() + " doesn't exist";
		}
		
	}
	
	@PatchMapping("/update/animal/name")
	public @ResponseBody String updateDescription(@RequestBody Map<String, String> deptInfo) {
		
		long id = Long.parseLong( deptInfo.get("id") );
		String description = deptInfo.get("description");
		
		Optional<Animal> found = service.findById(id);
		
		if(found.isPresent()) {
			 
			Animal toUpdate = found.get();
			
			String old = toUpdate.getDescription();
			
			toUpdate.setDescription(description);
			
			service.save(toUpdate);
			 
			return "Old Description: " + old + "\nNew Description: " + description;
		}
		else {
			return "Could not update description, animal with id = " + id + " doesn't exist";
		}
		
	}
	 
	
	@DeleteMapping("/delete/animal/{id}")
	public ResponseEntity<String> deleteAnimal(@PathVariable long id) {
	 	
		Optional<Animal> found = service.findById(id);
		
		if(found.isPresent()) {
			
			service.deleteById(id);
			
			return ResponseEntity.status(200).body("Deleted animal with id = " + id);	
		}
		else {
			return ResponseEntity.status(400)
					.header("animal id", id + "")
					.body("animal with id = " + id + " not found");
		}
			
	}

}








