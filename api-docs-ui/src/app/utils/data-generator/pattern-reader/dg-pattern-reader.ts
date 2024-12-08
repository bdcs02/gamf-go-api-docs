/* eslint-disable max-len */

interface GeneratedData {
	type: string;
	options: Map<string, any> | string;
	root: string;
}

enum DG_REG_EXP {
	IsData = '\\$\\{dg\\:[A-z]*(\\(\\)|\\((.*?)\\))\\}',
	GetType = '(?<=\\:)(.*?)(?=\\()',
	GetArrayType = 'type=[A-z]+',
	GetArrayParams = '(?<=type=[A-z]+\\()(.*?)(?=\\))',
	GetArrayLength = 'length=[0-9]+',
	IsFunction = '(?<=\\:)(.*?\\(\\))(?=)',
	GetSimpleOption = '(?<=\\()(.*)(?=\\))',
}

export class DgPatternReader {

	public processPatterns(root: string): GeneratedData[] {
		const generatedData: GeneratedData[] = [];
		const patternMatches = root.matchAll(RegExp(DG_REG_EXP.IsData, 'g'));
		for (const match of patternMatches) {
			match.map(item => {
				if (RegExp(DG_REG_EXP.IsData).exec(item)) {
					generatedData.push(this.getPatterns(item));
				}
			});
		}
		return generatedData;
	}

	public getPatterns(pattern: string): GeneratedData {
		const dataType = RegExp(DG_REG_EXP.GetType).exec(pattern)?.[0];
		let genData: GeneratedData = { options: '', root: '', type: '' };
		const optionsMap = new Map<string, any>();
		if (RegExp(DG_REG_EXP.IsData).exec(pattern)) {
			if (dataType === 'array') {
				const arrayOptions = new Map<string, any>();
				const arrayParams = new Map<string, any>();
				arrayOptions.set(RegExp(DG_REG_EXP.GetArrayType).exec(pattern)![0].split('=')[0], RegExp(DG_REG_EXP.GetArrayType).exec(pattern)![0].split('=')[1]);
				if (RegExp(DG_REG_EXP.GetArrayParams).exec(pattern)) {
					if (RegExp(DG_REG_EXP.GetArrayParams).exec(pattern)?.[0].includes(';')) {
						RegExp(DG_REG_EXP.GetArrayParams).exec(pattern)?.[0].split(';').map(
							item => {
								arrayParams.set(item.split('=')[0], item.split('=')[1]);
							});
					}
					else {
						if (RegExp(DG_REG_EXP.GetArrayParams).exec(pattern)![0] === '') {

							arrayParams.set(RegExp(DG_REG_EXP.GetArrayType).exec(pattern)![0].split('=')[0], RegExp(DG_REG_EXP.GetArrayType).exec(pattern)![0].split('=')[1]);

						}
						else {
							arrayParams.set(RegExp(DG_REG_EXP.GetArrayParams).exec(pattern)![0].split('=')[0], RegExp(DG_REG_EXP.GetArrayParams).exec(pattern)![0].split('=')[1]);
						}
					}
					arrayOptions.set(RegExp(DG_REG_EXP.GetArrayLength).exec(pattern)![0].split('=')[0], RegExp(DG_REG_EXP.GetArrayLength).exec(pattern)![0].split('=')[1]);
					arrayOptions.set('params', arrayParams);
					genData = {
						root: pattern,
						type: dataType,
						options: arrayOptions,
					};
				}
			}
			else {
				if (RegExp(DG_REG_EXP.IsFunction).exec(pattern)?.[0]) {
					genData = {
						root: pattern,
						type: dataType!,
						options: RegExp(DG_REG_EXP.IsFunction).exec(pattern)![0]
					};
				}
				if (RegExp(DG_REG_EXP.GetSimpleOption).exec(pattern)?.[0]) {

					if (RegExp(DG_REG_EXP.GetSimpleOption).exec(pattern)?.[0].includes(';')) {
						RegExp(DG_REG_EXP.GetSimpleOption).exec(pattern)?.[0].split(';').map(item => {
							if (item.includes('type')) {
								item = RegExp(DG_REG_EXP.GetSimpleOption).exec(pattern)![0].split(';').slice(0, 2).join();
								optionsMap.set(item.substring(0, item.indexOf('=')), item.substring(item.indexOf('=') + 1));
							}
							else {
								optionsMap.set(item.split('=')[0], item.split('=')[1]);
							}
						});
					}
					else {
						const optionsResult = RegExp(DG_REG_EXP.GetSimpleOption).exec(pattern)?.[0];
						optionsMap.set(optionsResult!.split('=')[0], optionsResult!.split('=')[1]);
					}
					genData = {
						root: pattern,
						type: dataType!,
						options: optionsMap
					};
				}
			}
		}
		return genData;
	}
}
