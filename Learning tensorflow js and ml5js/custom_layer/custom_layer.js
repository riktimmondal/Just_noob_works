class Antirectifier extends tf.layers.Layer {
	constructor() {
		super({});
		this.supportsmasking = true;
	}

	computeOutputShape(inputShape) {
		return [inputShape[0], inputShape[1], inputShape[2], 2*inputShape[3]];
	}

	call(inputs, kwargs) {
		let input = inputs;
		if (Array.isArray(input)) {
			input = input[0];
		}
		this.invokeCallHook(inputs, kwargs);
		 const origShape = input.shape;
    	const flatShape =
        	[origShape[0], origShape[1] * origShape[2] * origShape[3]];
        const flattened = input.reshape(flatShape);
        const centered = tf.sub(flattened, flattened.mean(1).expandDims(1));
	    const pos = centered.relu().reshape(origShape);
	    const neg = centered.neg().relu().reshape(origShape);
		return tf.concat([pos, neg], 3);
	}

	static get className() {
		return 'Antirectifier';
	}
}

tf.serialization.registerClass(Antirectifier);

export function antirectifier() {
	return new Antirectifier();
}