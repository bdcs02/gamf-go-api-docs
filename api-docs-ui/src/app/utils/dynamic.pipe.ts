import { Injector, Pipe, PipeTransform, Type } from '@angular/core';

@Pipe({
	name: 'dynamicPipe'
})
export class DynamicPipe implements PipeTransform {
	constructor(private readonly injector: Injector) {}

	public transform(value: unknown, requiredPipe?: Type<PipeTransform>, pipeArgs?: unknown): unknown {
		if (requiredPipe) {
			const injector = Injector.create({
				name: 'DynamicPipe',
				parent: this.injector,
				providers: [{ provide: requiredPipe }]
			});
			const pipe = injector.get(requiredPipe);
			return pipe.transform(value, pipeArgs);
		} else {
			return value;
		}
	}
}
