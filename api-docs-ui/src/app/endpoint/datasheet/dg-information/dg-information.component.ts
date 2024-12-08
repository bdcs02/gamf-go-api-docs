/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DATA_GENERATOR, GeneratorProps } from './dg-type-descriptions';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Clipboard } from '@angular/cdk/clipboard';
import { TranslateService } from '@ngx-translate/core';

interface DataGenerator {
	name: string;
	children?: DataGenerator[];
}


const TREE_DATA: DataGenerator[] = [
	{
		name: 'Adatgenerátor',
		children: [
			{
				name: 'Általános'
			},
			{
				name: 'Generátorok',
				children: [
					{
						name: 'STRING'
					},
					{
						name: 'NUMBER'
					},
					{
						name: 'REGEX'
					},
					{
						name: 'ARRAY'
					},
					{
						name: 'LOREM'
					},
					{
						name: 'DATE'
					},
					{
						name: 'EMAIL'
					},
					{
						name: 'BOOLEAN'
					},
					{
						name: 'USERNAME'
					},
					{
						name: 'PASSWORD'
					},
					{
						name: 'FLOAT'
					},
					{
						name: 'GEOROUTE'
					},
					{
						name: 'FILENAME'
					},
					{
						name: 'WORD'
					},
					{
						name: 'IP'
					},
					{
						name: 'HTTP_METHOD'
					},
					{
						name: 'HTTP_STATUS'
					},
					{
						name: 'URL'
					},
					{
						name: 'AVATAR'
					}
				]
			}
		]
	},
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
	expandable: boolean;
	name: string;
	level: number;
}


@Component({
	selector: 'information',
	templateUrl: './dg-information.component.html',
	styleUrl: './dg-information.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DgInformationComponent {
	public selectedNode: GeneratorProps;
	public activeNode: string = '';


	constructor(private readonly clipboard: Clipboard, private readonly translate: TranslateService) {
		this.dataSource.data = TREE_DATA;
		this.selectedNode = DATA_GENERATOR.dataGenerator.generalInformation['GENERAL'];
		this.activeNode = this.selectedNode.name;
		this.treeControl.expandAll();
	}
	public getNode(node: DataGenerator) {
		if (node.name === this.translate.instant('generator.information.general')) {
			this.selectedNode = DATA_GENERATOR.dataGenerator.generalInformation['GENERAL'];
			this.activeNode = this.selectedNode.name;
		} else {
			this.selectedNode = DATA_GENERATOR.dataGenerator.generators[node.name];
			this.activeNode = this.selectedNode.id;
		}
	}

	private _transformer = (node: DataGenerator, level: number) => ({
		expandable: !!node.children && node.children.length > 0,
		name: node.name,
		level,
	});

	treeControl = new FlatTreeControl<ExampleFlatNode>(
		node => node.level,
		node => node.expandable,
	);


	treeFlattener = new MatTreeFlattener(
		this._transformer,
		node => node.level,
		node => node.expandable,
		node => node.children,
	);

	dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

	hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}
