export interface InformationDialogOptions {
	titleTranslateKey: string;
	messageTranslateKey: string;
	messageTokenValues?: Record<string, unknown>;
	informationList?: string[];
	informationMap?: Map<string, string[]>;
	confirm?: boolean;
	buttonTranslateKey?: string;
}
