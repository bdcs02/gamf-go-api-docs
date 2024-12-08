import { Injectable } from '@angular/core';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { ApiData, Endpoint, FieldMap } from 'src/app/endpoint/api';
import { MapperNode } from '../viewers/struct-mapper/struct-mapper.component';
// @ts-expect-error @typescript-eslint/ban-ts-comment
import * as pdfMake from 'pdfmake/build/pdfmake';
// @ts-expect-error @typescript-eslint/ban-ts-comment
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../api.service';

(pdfMake as pdfMake.pdfMakeStatic).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
	providedIn: 'root'
})
export class PdfExportService {
	public apiData!: ApiData;
	private documentDefinition: pdfMake.TDocumentDefinitions;
	private endpointDictionary: { [category: string]: Endpoint[] } = {};
	constructor(
		private readonly translate: TranslateService,
		private readonly apiService: ApiService,
	) {
		this.translate.instant('pdf.title');
		this.apiService.getApiData().subscribe(response => {
			this.apiData = response;
		});
		this.documentDefinition = this.getDocumentDefinition();
	}

	public exportPdf(): void {
		this.writePdfContent(this.endpointDictionary, this.apiData);
		pdfMake.createPdf(this.documentDefinition).download(this.apiData?.appname + '-' + formatDate(Date.now(), 'yyyy-MM-dd', 'hu-HU') + '.pdf');
	}

	private getDocumentDefinition(): pdfMake.TDocumentDefinitions {
		this.documentDefinition = {
			pageMargins: [40, 80, 40, 60],
			header: [
				{
					fontSize: 10,
					margin: [0, 20, 40, 0],
					text: this.translate.instant('pdf.title'),
					alignment: 'right',
				},
				{ canvas: [{ type: 'line', x1: 40, y1: 10, x2: 595 - 40, y2: 10, lineWidth: 0.5 }] }
			],
			content: [
				{
					text: this.apiData?.appname ,
					fontSize: 30,
					margin: [0, 150, 0, 0],
					alignment: 'center'
				},
				{
					text: this.translate.instant('pdf.title'),
					fontSize: 20,
					margin: [0, 25, 0, 0],
					alignment: 'center',
				},
				{
					text: new Date().toLocaleDateString(),
					fontSize: 10,
					margin: [0, 50, 0, 0],
					alignment: 'center',
				},
				{
					text: 'Verzió: ' + environment.version,
					fontSize: 10,
					alignment: 'center',
					pageBreak: 'after',
				},
				{
					toc: {
						title: { text: this.translate.instant('pdf.tableOfContents'), fontSize: 20, bold: true },
					}
				},
				{
					text: '',
					pageBreak: 'after',
				},
			],
			styles: {
				header: {
					fontSize: 18,
					bold: true
				},
				bold: {
					bold: true
				},
			},
			footer: (currentPage: number, pageCount: number) => ({
				margin: 10,
				columns: [
					{
						fontSize: 10,
						text: this.translate.instant('pdf.pageNumber', { page: (currentPage.toString() + '/' + pageCount)}),
						alignment: 'right',
						margin: [0, 0, 40, 0]
					},
				],
			})
		};
		return this.documentDefinition;
	}

	private handleStructMapper(item: MapperNode[], level: number, table: pdfMake.TDocumentDefinitions['content']): void {
		for (let i = 0; i < item?.length; i++) {

			const validationMap = new Map<string, string>();

			this.getTag('validate', item[i]).split(',').forEach(param => {
				validationMap.set(param.split('=')[0], param.split('=')[1]);
			});

			item[i].required = this.getTag('validate', item[i]) !== '' && this.getTag('validate', item[i]).includes('required');
			item[i].minimum = validationMap.get('min') || validationMap.get('gt') || validationMap.get('gte') || validationMap.get('eq');
			item[i].maximum = validationMap.get('max') || validationMap.get('lt') || validationMap.get('lte') || validationMap.get('eq');

			let minMaxString = '';

			if (item[i].minimum !== undefined || item[i].maximum !== undefined) {
				minMaxString += '[' +
				(item[i].minimum !== undefined ? item[i].minimum : '') +
				';' +
				(item[i].maximum !== undefined ? item[i].maximum : '') +
				']';
			}
			const bodyTable = [];
			bodyTable.push({
				text: item[i].name + (item[i].required ? '*' : ''),
				border: [false, false, true, true],
				margin: [this.calculateNode(level), 0, 0, 0] });
			bodyTable.push({ text: item[i].kind + ' ' + minMaxString });
			bodyTable.push({ text: (item[i].description ? item[i].description + '\n' : ' ') + item[i].tag, border: [false, false, false, true] });
			table.table.body.push(bodyTable);

			if (item[i].fields?.length !== null) {
				this.handleStructMapper(item[i].fields as MapperNode[], level + 1, table);
			}
		}
	}

	private handleRecursiveReqRes(obj: string | object | any, level: number, table: pdfMake.TDocumentDefinitions['content']): void {
		Object.keys(obj).forEach(key => {
			const bodyTable = [];
			bodyTable.push({ text: key, border: [false, false, true, true], margin: [this.calculateNode(level), 0, 0, 0] });
			if (typeof obj[key] === 'object' && obj[key] !== null) {
				bodyTable.push({ text: '', border: [false, false, true, true], margin: [0, 0, 0, 0] });
				table.table.body.push(bodyTable);
				this.handleRecursiveReqRes(obj[key], level + 1, table);
			}
			else {
				bodyTable.push({ text: obj[key], border: [false, false, true, true], margin: [0, 0, 0, 0] });
				table.table.body.push(bodyTable);
			}
		});
	}

	private writePdfContent(endpointDictionary: { [category: string]: Endpoint[] }, apiData: ApiData): void {
		apiData.endpoints.forEach(item => {
			if (endpointDictionary[item.category]) {
				endpointDictionary[item.category].push(item);
			}
			else {
				endpointDictionary[item.category] = [item];
			}
		});

		let articleNumber = 1;
		for (const key in endpointDictionary) {
			this.documentDefinition.content.push({
				text: articleNumber + '. ' +
				key, fontSize: 20, style: 'bold', tocItem: true, margin: [10, 10, 10, 10] });
			let secondArticleNumber = 1;

			const endpoints = endpointDictionary[key];
			for (const endpoint of endpoints) {
				let remainedArticle = 1;
				this.documentDefinition.content.push({
					text: articleNumber +
					'.' + secondArticleNumber +
					' ' + endpoint.method +
					' ' + endpoint.path, fontSize: 16, style: 'header', tocItem: true, margin: [20, 0, 0, 0], tocMargin: [20, 0, 0, 0] });
				this.documentDefinition.content.push({
					text: articleNumber + '.' +
					secondArticleNumber + '.' +
					this.translate.instant('pdf.description',{ article: remainedArticle}),
					fontSize: 14, style: 'bold', tocItem: true, tocMargin: [30, 0, 0, 0], margin: [20, 5, 5, 0] });
				if (endpoint.description) {
					this.documentDefinition.content.push({ text: endpoint.description, fontSize: 12, margin: [20, 10, 10, 15] });
					remainedArticle++;
				}
				else {
					this.documentDefinition.content.push({ text: this.translate.instant('pdf.noData.noDescription'),
						fontSize: 12, margin: [20, 10, 10, 15] });
					remainedArticle++;
				}

				this.documentDefinition.content.push({
					text: articleNumber + '.' +
					secondArticleNumber + '.' +
					this.translate.instant('pdf.permission',{ article: remainedArticle}),
					fontSize: 14, style: 'bold', tocItem: true, tocMargin: [30, 0, 0, 0], margin: [20, 5, 5, 0] });
				if (endpoint.permission) {
					this.documentDefinition.content.push({ text: endpoint.permission, fontSize: 12, margin: [20, 5, 5, 15] });
					remainedArticle++;
				}
				else {
					this.documentDefinition.content.push({ text: this.translate.instant('pdf.noData.noPermission'),
						fontSize: 12, margin: [20, 5, 5, 15] });
					remainedArticle++;
				}

				if (endpoint.requestData) {
					this.writeContentBody(
						endpoint.requestData,
						articleNumber,
						secondArticleNumber,
						remainedArticle,
						this.translate.instant('pdf.exampleRequest'),
						'example');
					remainedArticle++;
				}
				if (endpoint.responseData) {
					this.writeContentBody(
						endpoint.responseData,
						articleNumber,
						secondArticleNumber,
						remainedArticle,
						this.translate.instant('pdf.exampleResponse'),
						'example');
					remainedArticle++;
				}
				if (endpoint.requestMapping) {
					this.writeContentBody(
						endpoint.requestMapping,
						articleNumber,
						secondArticleNumber,
						remainedArticle,
						this.translate.instant('pdf.structRequest'),
						'struct');
					remainedArticle++;
				}
				if (endpoint.responseMapping) {
					this.writeContentBody(
						endpoint.requestMapping,
						articleNumber,
						secondArticleNumber,
						remainedArticle,
						this.translate.instant('pdf.structResponse'),
						'struct');
					remainedArticle++;
				}
				secondArticleNumber++;
			}
			articleNumber++;
		}
	}

	private writeContentBody(
		item: any | FieldMap[],
		articleNumber: number,
		secondArticleNumber: number,
		remainedArticle: number,
		title: string,
		handleStructOrExample: string): void {
		if (item) {
			this.documentDefinition.content.push({
				text: articleNumber + '.' +
				secondArticleNumber + '.' +
				remainedArticle + ' ' + title, fontSize: 14, style: 'bold', tocItem: true, tocMargin: [30, 0, 0, 0], margin: [20, 5, 5, 0] });
			let table = {};

			switch (handleStructOrExample) {
				case 'struct':
					table = {
						table: {
							widths: ['30%', '20%', '50%'],
							body: [
								[
									{
										border: [false, false, false, true],
										text: this.translate.instant('pdf.table.name'),
									},
									{
										border: [false, false, false, true],
										text: this.translate.instant('pdf.table.type'),
									},
									{
										border: [false, false, false, true],
										text: this.translate.instant('pdf.table.description'),
									}
								],
							]
						},
						fontSize: 10,
						margin: [20, 5, 5, 0]
					};
					this.handleStructMapper(item, 0, table);
					this.documentDefinition.content.push(table);
					break;
				case 'example':
					table = {
						table: {
							widths: ['50%', '50%'],
							body: [
								[
									{
										border: [false, false, false, true],
										text: this.translate.instant('pdf.table.name'),
									},
									{
										border: [false, false, false, true],
										text: this.translate.instant('pdf.table.value'),
									},
								],
							],
						},
						fontSize: 10,
						margin: [20, 5, 5, 0]
					};
					if (typeof item === 'object' && item != null) {
						this.handleRecursiveReqRes(item, 0, table);
						this.documentDefinition.content.push(table);
					}
					else {
						this.documentDefinition.content.push({ text: item, fontSize: 12, margin: [20, 10, 10, 15] });
					}
					break;
			}
			this.documentDefinition.content.push({ text: '', pageBreak: 'after' });
		}
	}

	private getTag(tag: string, node: MapperNode): string {
		const regex = new RegExp(tag + ':"([^"]+)"');
		if (node.tag?.match(regex)?.[1]) {
			return node.tag.match(regex)![1];
		}
		return '';
	}

	private calculateNode(level: number): number {
		let node = 0;
		for (let i = 0; i < level; i++) {
			node += 15;
		}
		return node;
	}
}
