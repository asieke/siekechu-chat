import dotenv from 'dotenv';
dotenv.config();

type ENV = {
	SINCH_KEY: string;
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
	INCOMING_WEBHOOK_KEY: string;
	GOOGLE_SHEET_KEY: string;
};

export const { SINCH_KEY, SUPABASE_URL, SUPABASE_KEY, INCOMING_WEBHOOK_KEY, GOOGLE_SHEET_KEY } =
	process.env as ENV;
