export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			messages: {
				Row: {
					created_at: string;
					from: string | null;
					id: number;
					message: string | null;
					to: string | null;
				};
				Insert: {
					created_at?: string;
					from?: string | null;
					id?: number;
					message?: string | null;
					to?: string | null;
				};
				Update: {
					created_at?: string;
					from?: string | null;
					id?: number;
					message?: string | null;
					to?: string | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
