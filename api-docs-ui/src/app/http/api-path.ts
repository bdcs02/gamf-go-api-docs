import { environment } from 'src/environments/environment';

export const ApiPath = {
	// auth
	data: `${environment.srv}/data`,
	endpoint: `${environment.srv}/endpoint`,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getApiPath(url: string, ...params: any[]): string {
	params.forEach(param => {
		url = url.replace('{}', param.toString());
	});

	return url;
}
