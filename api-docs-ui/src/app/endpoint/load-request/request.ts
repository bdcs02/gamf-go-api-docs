import { FormGroup } from '@angular/forms';
import { EndpointForm } from '../datasheet/endpoint-form';

export interface RequestListItem {
	name: string;
	version: string;
	createDate: Date;
	config: FormGroup<EndpointForm>;
}
