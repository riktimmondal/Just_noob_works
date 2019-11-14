let video;
let poseNet;
let poses = [];

let brain;

let dataButton;
let dataLabel;
let trainButton;
let classificationP;

function setup() {
	createCanvas(320,240);
	video = createCapture(VIDEO);
	video.size(width, height);

	poseNet = ml5.poseNet(video,modelReady);

	poseNet.on('pose', function (results){
		poses = results;
	});

	video.hide();

	classificationP = createP('waiting to train model');

	dataLabel = createSelect();
	dataLabel.option('A');
	dataLabel.option('B');

	dataButton = createButton('add example');
	dataButton.mousePressed(addExample);

	trainButton = createButton('train model');
	trainButton.mousePressed(trainModel);

	let options = {
		inputs: 34,
	    outputs: 2,
	    task: 'classification',
	    debug: true
	};

	brain = ml5.neuralNetwork(options);
}

function trainModel() {
	brain.normalizeData();
	brain.train({
		epochs: 25
	}, finishedTraining);
}

function finishedTraining() {
	console.log('Done Training');
	classify();
}

function classify() {
	if(poses.length > 0) {
		let inputs =getInputs();
		brain.classify(inputs, gotResults);
	}
}

function gotResults(error, results) {
	if(error){
		console.log(error);
	}
	classificationP.html(`${results[0].label} (${floor(results[0].confidence * 100)})%`);
	classify();	
}

function getInputs() {
	let keypoints = poses[0].pose.keypoints;
	let inputs = [];
	for(let i=0; i<keypoints.length;i++){
		inputs.push(keypoints[i].position.x);
		inputs.push(keypoints[i].position.y);
	}
	return inputs;
}

function addExample() {
	if(poses.length > 0) {
		let inputs =getInputs();
		let target = dataLabel.value();
		brain.addData(inputs, [target]);
	}
}

function modelReady() {
	console.log('Model loaded');
}

function draw(){
	image(video, 0 ,0, width,height);
	strokeWeight(2);
	if (poses.length > 0) {
		let pose = poses[0].pose;
		for(let i = 0; i < pose.keypoints.length; i++) {
			fill(213,0,143);
			noStroke();
			ellipse(pose.keypoints[i].position.x, pose.keypoints[i].position.y, 8);
		}
	}
}