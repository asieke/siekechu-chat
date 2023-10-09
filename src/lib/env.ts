import dotenv from 'dotenv';
dotenv.config();

export const SINCH_KEY: string = process.env.SINCH_KEY!;
export const SUPABASE_URL: string = process.env.SUPABASE_URL!;
export const SUPABASE_KEY: string = process.env.SUPABASE_KEY!;
export const INCOMING_WEBHOOK_KEY: string = process.env.INCOMING_WEBHOOK_KEY!;
export const GOOGLE_SHEET_KEY: string = process.env.GOOGLE_SHEET_KEY!;
export const OPENAI_KEY: string = process.env.OPENAI_KEY!;

export const GOOGLE_URL =
	'https://script.google.com/macros/s/AKfycbwCxv7v_FR4rv2JTwbTpQo9ZGh7qzawfyPy9f1ndYFNWR7bxMoYK-SS2egbkcnurtoV/exec';
