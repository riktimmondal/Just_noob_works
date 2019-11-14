let faceapi;
let detections = [];

let video;

let faceBrain;

let osc;
let freqMax = 800;

let trained = false;
let collecting = false;

function setup() {
	createCanvas(360,270);
	video = createCapture(VIDEO);
	video.size(width, height);
	//video.hide();

	const faceOptions = {withLandmarks: true, withDescriptors: false};
	faceapi = ml5.faceApi(video, faceOptions, faceReady);

	const options = {
		inputs: 68 * 2,
	    outputs: 1,
	    learningRate: 0.02,
	    debug: true,
	};

	faceBrain = ml5.neuralNetwork(options);

	select('#collectData').mousePressed(collectData);
	select('#train').mousePressed(trainModel);

	osc = new p5.Oscillator();
	osc.setType('sine');
}

function faceReady() {
	faceapi.detect(gotFaces);
}

function gotFaces(error, results) {
	if (error) {
		console.log(error);
		return;
	}

	detections = results;
	faceapi.detect(gotFaces);
}

function draw() {
	background(0);

	if(detections.length > 0) {
		let points =detections[0].landmarks.positions;
		for(let i=0; i< points.length;i++)
		{
			stroke(161,95,251);
			strokeWeight(4);
			point(points[i]._x, points[i]._y);
		}
	}

	if (collecting) {
		let freq = parseFloat(select('#frequency_slider').value());
		select('#training_freq').html(freq);
		osc.freq(freq);

		let inputs = getInputs();
		if(inputs) {
			faceBrain.addData(inputs, [freq]);
		}
	}
}

function getInputs() {
	if(detections.length > 0) {
		let points = detections[0].landmarks.positions;
	    let inputs = [];
	    for (let i = 0; i < points.length; i++) {
	      inputs.push(points[i]._x);
	      inputs.push(points[i]._y);
	    }
	    return inputs;
	}
}

function collectData() {
	osc.start();
	osc.amp(5);
	collecting = true;
}

function trainModel() {
	collecting = false;
	osc.amp(0);

	faceBrain.normalizeData();
	faceBrain.train({ epochs: 50}, finishedTraining);
}

function finishedTraining() {
	console.log('done');
	osc.amp(0.5);
	predict();
}

function predict() {
	let inputs = getInputs();
	faceBrain.predict(inputs, gotFrequency);
}

function gotFrequency(error, outputs) {
	if (error) {
    console.error(error);
    return;
  }
  frequency = outputs[0].value;
  osc.freq(frequency);
  select('#prediction').html(frequency.toFixed(2));
  predict();
}