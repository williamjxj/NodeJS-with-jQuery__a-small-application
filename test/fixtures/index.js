var id = require('pow-mongodb-fixtures').createObjectId
	, userModelName = "User"
	, postModelName = "Post";



exports[userModelName] = {
	enjeru: {
		_id: id()
		, username: 'Enjeru'
		, first_name: 'Slava'
		, middle_name: 'Enjeru'
		, last_name: 'Nikolaenko'
		, gender: 'male'
		, created_time: new Date()
		, updated_time: new Date()
		, email: 'vyacheslav.nickolaenko@peoplemelt.com'
		, password: '123'
	}
	, muteki: {
		_id: id()
		, username: 'Muteki'
		, first_name: 'Maxim'
		, middle_name: 'Muteki'
		, last_name: 'Knutov'
		, gender: 'male'
		, created_time: new Date()
		, updated_time: new Date()
		, email: 'somewhere@else.com'
		, password: '1234'
	}
	, niakris: {
		_id: id()
		, username: 'Niakris'
		, first_name: 'Valeriy'
		, middle_name: 'Niakris'
		, last_name: 'Anonim'
		, gender: 'male'
		, created_time: new Date()
		, updated_time: new Date()
		, email: 'somewhere2@else.com'
		, password: '123321'
	}
};

exports[postModelName] = {
	post1: {
		_user: exports[userModelName].muteki._id
		, message: "I lated"
		, place_text: "No sense"
		, tags: [ 'Tag2' ]
		, special: false
		, lat: 45.5885321
		, long: 30.4525647
		, created_time: new Date()
		, updated_time: new Date()
	}
	, post2: {
		_user: exports[userModelName].enjeru._id
		, message: "I just post something ;)"
		, place_text: 'Here :)'
		, tags: [ 'Tag1', 'Tag2', 'Cool' ]
		, special: false
		, lat: 45.585547
		, long: 30.455855
		, created_time: new Date()
		, updated_time: new Date()
	}
	, post3: {
		_user: exports[userModelName].enjeru._id
		, message: "I just post something again ;)"
		, place_text: "And I'm still here :)"
		, tags: [ 'Tag1', 'Tag3', 'Cool' ]
		, special: false
		, lat: 45.585842
		, long: 30.455244
		, created_time: new Date()
		, updated_time: new Date()
	}
	, post4: {
		_user: exports[userModelName].muteki._id
		, message: "I want to post it too"
		, place_text: "Somewhere else"
		, tags: [ 'Tag2', 'Tag3', 'Cool' ]
		, special: false
		, lat: 45.585812
		, long: 30.455257
		, created_time: new Date()
		, updated_time: new Date()
	}
	, post5: {
		_user: exports[userModelName].niakris._id
		, message: "If you can post it, please post it :)"
		, place_text: "Somewhere else but still here )"
		, tags: [ 'Tag2', 'Tag3' ]
		, special: false
		, lat: 45.581723
		, long: 30.454588
		, created_time: new Date()
		, updated_time: new Date()
	}
	, post6: {
		_user: exports[userModelName].muteki._id
		, message: "Where am I?"
		, place_text: "I want to know it"
		, tags: [ 'Tag4', 'Tag1', 'Cool' ]
		, special: false
		, lat: 75.1254001
		, long: 12.5444744
		, created_time: new Date()
		, updated_time: new Date()
	}
	, post7: {
		_user: exports[userModelName].muteki._id
		, message: "Myspacebuttondoesn'twork"
		, place_text: "Tailand? oO"
		, tags: [ 'Tag2', 'Tag3', 'Cool' ]
		, special: false
		, lat: 45.5815963
		, long: 30.452135777
		, created_time: new Date()
		, updated_time: new Date()
	}
	, post8: {
		_user: exports[userModelName].niakris._id
		, message: "I live here"
		, place_text: "At home"
		, tags: [ 'Tag2', 'Tag14', 'Cool' ]
		, special: false
		, lat: 45.5823536
		, long: 30.451275
		, created_time: new Date()
		, updated_time: new Date()
	}
	, post9: {
		_user: exports[userModelName].enjeru._id
		, message: "Party will be here ;)"
		, place_text: "Party place"
		, tags: [ 'Cool' ]
		, special: false
		, lat: 45.582347
		, long: 30.459542
		, created_time: new Date()
		, updated_time: new Date()
	}
	, post10: {
		_user: exports[userModelName].enjeru._id
		, message: "Friday night let's go"
		, place_text: "Not at home"
		, tags: [ 'Tag2', 'Tag3', 'Cool' ]
		, special: false
		, lat: 45.582156
		, long: 30.4552227
		, created_time: new Date()
		, updated_time: new Date()
	}
	, post11: {
		_user: exports[userModelName].enjeru._id
		, message: "Finish it"
		, place_text: "Here"
		, tags: [ 'Tag3']
		, special: false
		, lat: 45.5821845
		, long: 30.45532547
		, created_time: new Date()
		, updated_time: new Date()
	}
}