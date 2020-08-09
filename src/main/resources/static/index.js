function initialize() {
    renderModal("createAnimal", "modals");
    // This render Modal call create our button and modal for creating a student at page onload.
    
    // Our get students function also does our rendering of all our cards, by calling the renderStudent() function.
    getAnimals("/api/animals");
}

// AJAX call and rendering using rederStudent() inside
function getAnimals(url) {

    //make initial api call to get Student list
    var xhttpList = new XMLHttpRequest();

    // Read JSON - and put in storage
    xhttpList.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            renderAnimal(this.responseText);
        }
    };
    xhttpList.open("GET", url, true);
    xhttpList.send();
    console.log("Animal List stored");

}

// We need this single student AJAX call to get API data when we update the student
function getOneAnimal(id) {
    var url = "/api/animals/" + id;
    //make initial api call to get Student list
    var xhttpList = new XMLHttpRequest();
    var animal;

    // Read JSON - and put in storage
    xhttpList.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            sessionStorage.setItem("animal", this.responseText);
        }
    };
    xhttpList.open("GET", url, false);
    xhttpList.send();
    console.log("Single animal retrieved");

    return sessionStorage.getItem("animal");
}

function renderAnimal(data) {
    var json = JSON.parse(data);


    // Ajax returns an array of JSON objects - the index represents each individual JSON object from our AJAX call
    // We can the iterate over all of our students
    for (var index = 0; index < json.length; index++) {
        // We wrtie our HTML in a string and use the insertAdjacentHTML(placement, string) where we pass the string to be rendered on our page
        var cardHtml = '  <div class="card"  style="width:400px" id="' + json[index].id + '">'
            + '<div class ="card-header"><h3>' + json[index].name +  '</h3>'
            + '<img class="card-img-top" src=' + json[index].imagePath + ' alt="Card image" style="width:100%;height:100px">'
            + '<div class="card-body">'
            + '<h4 class="card-title">' + json[index].species + '</h4>'
            + '<p class="card-text">' + json[index].lifespan + '</p>'
            + '<p class="card-text">' + json[index].description+ '</p>'
            + '<div id="update' + json[index].id + '">'
            + '<button class="btn btn-danger" onclick="deleteAnimal(' + json[index].id + ')">Delete</button>'
            + '</div>'
            + '</div>'
            + '</div>';
        console.log("Student Card with ID: " + json[index].id + " created");

        var cardDeck;
        if (index % 5 == 0) {
            cardDeck = document.createElement("div");
            cardDeck.classList.add("card-deck");
            cardDeck.id = "deck" + index;
            document.getElementById("animals").appendChild(cardDeck);
            cardDeck = document.getElementById("deck" + index);
        }

        cardDeck.insertAdjacentHTML('beforeend', cardHtml);
        // Once the student cards are created and rendered on our page, we can then find them and add on the update buttons with associated modals
        renderModal("updateAnimal", json[index].id);
    }
}

function renderModal(modalPurpose, id) {

    var location;
    var color;
    var btntxt;
    var animal;
    var animalID = '';

    // Switch allows us to choose our format based on Create or Update
    switch (modalPurpose) {
        case "createAnimal":
            location = id;
            color = "btn-success";
            btntxt = "Create an Animal";
            break;
        case "updateAnimal":
            animal = getOneAnimal(id);
            animalID = JSON.parse(animal).id;
            location = "update" + id;
            color = "btn-warning";
            btntxt = "Update";
            break;
    }

    // Button creation and placement - based on the Switch case above
    var buttonHtml = '<button type="button" class="btn ' + color + '" data-toggle="modal" data-target="#' + modalPurpose + animalID + '">' + btntxt + '</button>';
    document.getElementById(location).insertAdjacentHTML('beforeend', buttonHtml);


    // String that contains the HTML to render our modals
    // Note that Modals pair to buttons through the modal's id, and the button's data-target attributes. 
    var modalHtml = ' <div class="modal fade" id="' + modalPurpose + animalID + '"> '
        + ' <div class="modal-dialog modal-xl"> '
        + ' <div class="modal-content"> '

        + '<div class="modal-header">'
        + '<h4 class="modal-title">'+ modalPurpose + '</h4>'
        + '<button type="button" class="close" data-dismiss="modal">&times;</button>'
        + '</div>'

        + '<div class="modal-body">'
        + animalForm(animal, modalPurpose)
        + '</div>'

        + '<div class="modal-footer">'
        + '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'
        + '</div>'

        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>';

    // Write the modal in the appropriate place.  All modals can be written to the same place on the page, as this does not affect display our function.
    document.getElementById("modals").insertAdjacentHTML('beforeend', modalHtml);

}

function updateAnimal(id) {

    // Just like in Create, we need to populate the JSON student that we will put in our AJAX body to submit to our API
    // We need the id this time, since we need to know which student we are updating.
    var sendData = {
        "id": id,
        "name": document.getElementById("updateAnimalname"+id).value,
        "species": document.getElementById("updateAnimalspecies"+id).value,
        "lifespan": document.getElementById("updateAnimallifespan"+id).value,
        "description": document.getElementById("updateAnimaldescription"+id).value,
        "imagePath": document.getElementById("updateAnimalimagePath"+id).value
    }
    console.log(sendData);

    var ok = confirm("Please confirm you wish to apply these changes");

    // Just like create, we set our headers to show our data is JSON
    if (ok == true) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/api/update/animal", true);

        xhttp.setRequestHeader('content-Type', 'application/json');
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Update success");
                var display = document.getElementById("animals");
                display.innerHTML = '';
                getAnimals("/api/animals");
            }
        };
        // Be sure that the JSON student is coverted to String before sending, using JSON.stringify
        xhttp.send(JSON.stringify(sendData));
    }
}

function createAnimal() {

    // We need the JSON that will be in our POST body.  We retrieve the data from the form and store in the values.
    var sendData = {
        "name": document.getElementById("createAnimalname").value,
        "species": document.getElementById("createAnimalspecies").value,
        "lifespan": document.getElementById("createAnimallifespan").value,
        "description": document.getElementById("createAnimaldescription").value,
        "imagePath": document.getElementById("createAnimalimagePath").value
    }
    console.log(sendData);

    // Confirmation about creating
    var ok = confirm("Ready to send?");

    if (ok == true) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/api/add/animal", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Update success");
                // We need to refresh the display to show our new student, so we clear the div with our current cards on 
                // display.  Then we call the function getStudents() to reload our cards.
                var display = document.getElementById("animals");
                display.innerHTML = '';
                getAnimals("/api/animals");
                console.log("Animal created!");
            }
        };
        // When we send our JSON student, we need to covert it to String using JSON.stringify.  The header is what let's our recipient know that it should
        // be read as JSON
        xhttp.send(JSON.stringify(sendData));
    }

}



function animalForm(animal, purpose) {
    // Initialize our variables that will put injected in the form.
    var input;
    var id;
    var name;
    var species;
    var lifespan;
    var description;
    var imagePath;
    var action;

    // Switch statement assigns variables based on create or update.  If update is selected, our variables are read from the single student JSON,
    // using the getOneStudent(id) method
    switch (purpose) {
        case "createAnimal":
            input = '';
            id ='';
            name = '';
            species = '';
            lifespan = '';
            description = '';
            imagePath = '';
            action = 'createAnimal()';
            break;
        case "updateAnimal":
            input = JSON.parse(animal);
            id = input.id;
            name = input.name;
            species = input.species;
            lifespan = input.lifespan;
            description = input.description;
            imagePath = input.imagePath;
            action = 'updateAnimal(' + input.id + ')';
            break;
    }

    // The actual HTML that will be returned (called later by the modal) stored in String form
    // The variables are set based on create or update.  The value attributes of the input elements are key to filling in the form with the existing
    // student data
    var form = ''
        + '<form>'
        + '<div class="input-group mb-3">'
        + '<div class="input-group-prepend">'
        + '<span class="input-group-text">Name</span>'
        + '</div>'
        + '<input type="text" class="form-control" placeholder="Enter name" id="' + purpose + 'name' + id +'" value="' + name + '">'
        + '</div>'
        + '<div class="input-group mb-3">'
        + '<div class="input-group-prepend">'
        + '<span class="input-group-text">Species</span>'
        + '</div>'
        + '<input type="text" class="form-control" placeholder="Enter species" id="' + purpose + 'species' + id +'" value="' + species + '">'
        + '</div>'
        + '<div class="input-group mb-3">'
        + '<div class="input-group-prepend">'
        + '<span class="input-group-text">lifespan</span>'
        + '</div>'
        + '<input type="text" class="form-control" placeholder="Enter lifespan" id="' + purpose + 'lifespan' + id +'" value="' + lifespan + '">'
        + '</div>'
        + '<div class="input-group mb-3">'
        + '<div class="input-group-prepend">'
        + '<span class="input-group-text">Description</span>'
        + '</div>'
        + '<input type="text" class="form-control" placeholder="Enter description" id="' + purpose + 'description' + id +'" value="' + description + '">'
        + '</div>'
        + '<div class="input-group mb-3">'
        + '<div class="input-group-prepend">'
        + '<span class="input-group-text">Image URL</span>'
        + '</div>'
        + '<input type="text" class="form-control" placeholder="Enter image URL" id="' + purpose + 'imagePath' + id +'" value="' + imagePath + '">'
        + '</div>'
        + '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="' + action + '">Submit</button>'
        + '</form>';

        // The HTML of the form above is a string, and can be called by other functions to be rendered where appropriate.
    return form;
}

function deleteAnimal(id) {
    // We append the URL to have the id based on what is passed, for our API
    var link = "/api/delete/animal/" + id;
    console.log("Loaded into delete function");

    var ok = confirm("Are you sure you want to delete?\nPress 'OK' to confirm, or 'cancel' to cancel");
    if (ok == true) {

        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", link, true);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // The deletion from the database happens when this call is sent, however we also need to remove
                // from the page.  We do that by grabbing the card by id (which is the same as the student id) and then navigate to its parent node.
                // We can then from the parent node, call the removeChild() and say which card to remove.
                var removeCard = document.getElementById(id);

                removeCard.parentNode.removeChild(removeCard);
                console.log("Student deleted.");
            }
        };
        // No data to be sent in body
        xhttp.send(null);
    }
}


