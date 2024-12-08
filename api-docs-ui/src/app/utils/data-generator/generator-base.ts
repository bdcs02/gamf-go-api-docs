

export class GeneratorBase {

	private min: number = 0;
	private max: number = 0;

	constructor(defaultMin: number, defaultMax: number) {
		this.min = defaultMin;
		this.max = defaultMax;
	}

	public getMin(): number {
		return this.min;
	}
	public getMax(): number {
		return this.max;
	}
	public setMin(min: number): number {
		this.min = min;
		return this.min;
	}
	public setMax(max: number): number {
		this.max = max;
		return max;
	}

	public getOptionsMinMax(options: Map<string, any>): void {
		if (typeof options === 'object') {
			for (const item of options.keys()) {
				if (item === 'min') {
					this.setMin(options.get(item));
				}
				if (item === 'max') {
					this.setMax(options.get(item));
				}
			}
		}
	}
}
