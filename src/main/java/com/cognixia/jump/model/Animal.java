package com.cognixia.jump.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity 
public class Animal implements Serializable {
	private static final long serialVersionUID = 1l;
	// @Id --> primary key
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	// @Column --> providing definitions on how to set up our column
	//name --> set the column name used in table
	@Column(unique = true, nullable = false)
	private String name; 
	
	@Column(name = "species")
	private String species;
	
	@Column(name = "average_life_Span")
	private String lifespan;
	
	@Column(unique = true, nullable = false)
	private String description;
	
	@Column(name = "image_path")
	private String imagePath;
	
	// columnDefinition --> give full definition of column, giving type and any constraints
	public Animal () {
		this(-1L, "N/A", "N/A", "N/A", "N/A", "N/A");
	}
	
	public Animal(Long id, String name, String species, String lifespan, String description, String imagePath) {
		super();
		this.id = id;
		this.name = name;
		this.species = species;
		this.lifespan = lifespan;
		this.description = description;
		this.imagePath = imagePath;
	}

	public Long getId() {
		return id;
	}



	public void setId(Long id) {
		this.id = id;
	}



	public String getName() {
		return name;
	}



	public void setName(String name) {
		this.name = name;
	}
	
	public String getSpecies() {
		return species;
	}



	public void setSpecies(String species) {
		this.species = species;
	}
	
	
	public String getLifespan() {
		return lifespan;
	}



	public void setLifespan(String lifespan) {
		this.lifespan = lifespan;
	}



	public String getDescription() {
		return description;
	}



	public void setDescription(String description) {
		this.description = description;
	}



	public String getImagePath() {
		return imagePath;
	}



	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}



	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "Animal [id=" + id + ", name=" + name + ", species=" + species + ", lifespan=" + lifespan
				+ ", description=" + description + ", imagePath=" + imagePath + "]";
	}



	
	
	
	
	
	

}
