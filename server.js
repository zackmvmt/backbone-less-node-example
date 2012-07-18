// --------- SETUP ---------- \\

// get the required node modules
var _ = require('underscore');
var express = require('express');

// start up the server and send the console a message
var app = express.createServer();
app.listen(8000);
console.log('Express server started on port 8000');

// --------- DATABASE ---------- \\

// create a "database" when the server starts
// NOTE: this is just a simple array of objects, normally this would be a real db
var people = [
	{
		id:				1,
		first_name:		'Zack',
		last_name:		'Stickles',
		phone_number:	'444-444-4444',
		notes:			"It's me!"	
	},
	{
		id:				2,
		first_name:		'John',
		Last_name:		'Doe',
		phone_number:	'555-555-5555',
		notes:			"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
	}
];

// --------- ROUTES ---------- \\

// GET ROUTE
// gets all of the people, or a specific one if the id is provided
app.get('/api/people/:id?', function(req, res) {

	// if they have suppllied an id
	if (req.params.id) {
		
		// use underscore to find the person with that id
		var person = _.find(people, function(p) {
			return p.id == req.params.id;
		});
		
		res.send(person);
		
	// otherwise, just send all of the people
	} else {
		
		res.send(people);
		
	}

});

// POST ROUTE
// add a new person to the "database"
app.post('/api/people', express.bodyParser(), function(req, res) {

	// if they have provided us with some information
	if (req.body) {
	
		// get the appropriate id (NOTE: this is not the ideal way to do this)
		req.body.id = _.last(people).id + 1;
		
		// make a new person object with all the values
		people.push(req.body);
		
		// send back the json object
		res.send(req.body);
		
	// otherwise, we are missing some info
	} else {
		
		res.send({status: 'error', response: 'missing necessary information'});
		
	}

});

// PUT ROUTE
// update an existing person in the "database"
app.put('/api/people/:id', express.bodyParser(), function(req, res) {

	// if they have provided us with some information
	if (req.body) {
		
		// loop through the people database using underscore
		_.each(people, function(p) {
		
			// if this person is the one we are looking for
			if (p.id == req.params.id) {
				
				// update the person with the information provided
				var person = _.extend(p, req.body);
				
				// send back the new person
				res.send(person);
				
			}
		
		});
	
	// otherwise, we are missing some information	
	} else {
		
		res.send({status: 'error', response: 'missing necessary information'});
		
	}

});

// DELETE ROUTE
// delete an existing person in the "database"
app.delete('/api/people/:id', function(req, res) {

	// try to delete the person
	try {
		
		// user underscore to remove the person
		people = _.reject(people, function(p) {
			return p.id == req.params.id;
		});
		
		// send back a success message
		res.send({status: 'success', response: 'person was removed successfully'});
		
	// if we could not delete the person for whatever reason, spit back an error	
	} catch(e) {
		
		res.send({status: 'error', response: 'could not delete the person'});
		
	}

});