let nn;

function setup() {
	const options = {
		inputs: 1,
		outputs:1,
		task: 'regression',
		debug: true,
		activationHidden: 'relu',
	  debug: true,
	  learningRate: 0.000000001,
	  hiddenUnits: 20,
	  modelOptimizer: 'adam'
	};
	nn = ml5.neuralNetwork(options);

	//trainModel();

	let trainBtn = createButton('Train Model');
	trainBtn.position(10,50);
	trainBtn.mousePressed(function() {
		trainModel();
	});

	let predictBtn = createButton('Predict');
	predictBtn.position(10,70);
	predictBtn.mousePressed(function() {
		predict();
		
	});

	let saveBtn = createButton('Save Model');
	saveBtn.position(10,90);
	saveBtn.mousePressed(function() {
		nn.save();
	});

	let loadLocalBtn = createButton('Load the model from file system');
	loadLocalBtn.position(10,110);
	loadLocalBtn.mousePressed(function() {
		nn.load('model/model.json', function () {
			console.log('MOdel Loaded');
		});
	});

	let loadBtn = select('#load');
	loadBtn.changed(function () {
		nn.load(loadBtn.elt.files, function () {
			console.log('MOdel Loaded');
		});
	});
}

function trainModel() {
	// let a, b, c;
	// let training_target;
	// for(let i=0;i<500;i++) {
	// 	if (i%2) {
	// 		a = Math.random(0, 0.16);
	// 	      b = Math.random(0.16, 0.32);
	// 	      c = Math.random(0.32, 0.5);
	// 	      training_target = [0, 0]
	// 	} else {
	// 		a = Math.random(0.5, 0.66);
	// 	      b = Math.random(0.66, 0.82);
	// 	      c = Math.random(0.82, 1);
	// 	      training_target = [1, 1]
	// 	}
		for(let i=1;i<=1000;i++)
		{
			nn.addData([i],[i**2]);
		}


		//const training_input = [a,b,c];
		
	//}

	const trainingOptions = { 
		epochs: 10,
		batchSize: 10
	};

	nn.normalizeData();
	nn.train(trainingOptions, finishedTraining);
}

function finishedTraining() {
	predict();
}

function predict() {
	 // const a = 0.1;
	 //  const b = 0.2;
	 //  const c = 0.4;
	 //  const input = [a, b, c];
	 //  // we should expect [0,0]
	 //  nn.predict(input, gotResults);
	 nn.predict([1], gotResults)
}

function gotResults(error, results) {
	if (error) console.log(error);
	  if (results) {
	    console.log(results[0]);
	    //results.tensor.print()
	}
}