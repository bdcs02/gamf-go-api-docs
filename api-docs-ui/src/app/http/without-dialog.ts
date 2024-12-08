import { HttpHeaders } from '@angular/common/http';

export const withoutDialogHeader = 'X-WITHOUT-DIALOG';

export const withoutDialog = {
	headers: new HttpHeaders({
		[withoutDialogHeader]: ''
	})
};
