export type NotificationType = 'success' | 'info' | 'warn' | 'error';

export interface Notification {
	type: NotificationType;
	message?: string;
	translate?: string;
	details?: string;
}
