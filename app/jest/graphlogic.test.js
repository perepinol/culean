const logic = require('../graphlogic');

test('The "week,hours" data is transformed correctly into the coordinates, on get Values()', () => {
	const mydata = "0,20\n1,30"; // starting for week 0, converts to x=1;
									//factor=0.4
	const expected = [
	{'x':1, 'y':20, 'yhat':20*0.4}, //8
	{'x':2, 'y':30, 'yhat':((30-8)*0.4)+8} //16.8
	];
	
  expect(logic.getValues(mydata)).toEqual(expected);
});


test('Longer correct test on getValues()', () => {
	const mydata = "0,20\n1,30\n2,30\n3,35\n4,40"; // starting for week 0, converts to x=1;
	
	function round(value) {
		return Number(Math.round(value+'e'+2)+'e-'+2);
	}
	const expected = [
	
	{'x':1, 'y':20, 'yhat':8},						// 8 //  factor * +coords[i].y),
	{'x':2, 'y':30, 'yhat':round(((30-8)*0.4)+8)},			// 16,8 // data[i-1].yhat + (+coords[i].y - data[i-1].yhat) * factor),
	{'x':3, 'y':30, 'yhat':round(((30-16.8)*0.4)+16.8)},	// 22.08
	{'x':4, 'y':35, 'yhat':round(((35-22.08)*0.4)+22.08)},	// 27.25
	{'x':5, 'y':40, 'yhat':round(((40-27.25)*0.4)+27.25)}	// 32.5
	
	];
	
  expect(logic.getValues(mydata)).toEqual(expected);
});


test('Empty string as argument on getValues()', () => {
	const mydata = "";
	const expected = "[]";
			
  expect(logic.getValues(mydata)).toEqual(expected);
});

test('Incorrect string as argument on get Values()', () => {
	const mydata = "Some malicious text";
	const expected = "[]";
			
  expect(logic.getValues(mydata)).toEqual(expected);
});

/////////////////////////////////////////////////////////////////// getNames() ---->   country;user1,machine1,machine2;user2;user3  \n  country2;user45;user112


test('empty string on getNames() ', () => {
	const mydata = "";
	const expected =  [];
			
  expect(logic.getNames(mydata)).toEqual(expected);
});

test('correct test on getNames() ', () => {
	const mydata = "Spain;Arnau,machine1,machine2";
	const expected =  {'Spain':{'Arnau':['machine1','machine2']}}
			
  expect(logic.getNames(mydata)).toEqual(expected);
});

test('correct test with two countries and diferent users, on getNames() ', () => {
	const mydata = "Spain;Arnau,machine1,machine2\nGermany;Pere,machine3;Jordi,machine16,machine32";
	const expected =  {'Spain':{'Arnau':['machine1','machine2']}, 'Germany':{'Pere':['machine3'], 'Jordi':['machine16', 'machine32']}}
		
  expect(logic.getNames(mydata)).toEqual(expected);
});


test('html as argument on getNames return an empty dictionary, on getNames()', () => {
	const mydata = "<html><body></body></html>";
	const expected = {};
			
  expect(logic.getNames(mydata)).toEqual(expected);
});




