export type EventRecord = Partial<{
	name: string;
	description: string;
	type: 'solo' | 'group';
	rules: string;
	submission_deadline: string;
	registration_url: string;
}>;
