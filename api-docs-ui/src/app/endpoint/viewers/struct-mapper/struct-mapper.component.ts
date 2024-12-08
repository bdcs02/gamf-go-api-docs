import { Component, Input, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FieldMap } from '../../api';

export interface MapperNode {
	name: string;
	description?: string;
	tag: string;
	required?: boolean;
	minimum?: string;
	maximum?: string;
	type: string;
	kind: string;
	key?: object;
	fields?: MapperNode[];
}

interface MapperFlatNode {
	expandable: boolean;
	name: string;
	data: MapperNode;
	level: number;
}

@Component({
	selector: 'struct-mapper',
	templateUrl: './struct-mapper.component.html',
	styleUrl: './struct-mapper.component.scss'
})
export class StructMapperComponent implements OnInit {

	@Input() public content!: FieldMap[];

	public treeControl!: FlatTreeControl<MapperFlatNode>;
	public treeFlattener!: MatTreeFlattener<any, any, any>;
	public dataSource!: MatTreeFlatDataSource<any, any>;

	constructor(){
		this.treeControl = new FlatTreeControl<MapperFlatNode>(
			node => node.level,
			node => node.expandable,
		);

		this.treeFlattener = new MatTreeFlattener(
			this.transformer,
			node => node.level,
			node => node.expandable,
			node => node.fields,
		);

		this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
	}

	hasChild = (_: number, node: MapperFlatNode): boolean => node.expandable;

	public ngOnInit(): void {
		if (this.content !== null) {
			this.dataSource.data = this.content;
		}
	}

	public getTag(tag: string, node: MapperNode): string {
		const regex = new RegExp(tag + ':"([^"]+)"');
		if(RegExp(regex).exec(node.tag)?.[1])
		{
			return RegExp(regex).exec(node.tag)![1];
		}
		return '';
	}

	private readonly transformer = (node: MapperNode, level: number): { expandable: boolean; name: string; level: number; data: MapperNode } => {
		const validationMap = new Map<string, string>();

		this.getTag('validate',node).split(',').forEach(param => {
			validationMap.set(param.split('=')[0], param.split('=')[1]);
		});

		node.required = this.getTag('validate',node) !== '' && this.getTag('validate',node).includes('required');
		node.minimum = (validationMap.get('min') ?? (validationMap.get('gt')) ?? validationMap.get('gte')) ?? validationMap.get('eq');
		node.maximum = (validationMap.get('max') ?? (validationMap.get('lt')) ?? validationMap.get('lte')) ?? validationMap.get('eq');

		return {
			expandable: !!node.fields && node.fields.length > 0,
			name: node.name,
			level,
			data: node,
		};
	};
}
