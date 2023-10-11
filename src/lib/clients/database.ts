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
			webhooks: {
				Row: {
					body: string | null;
					created_at: string;
					from: string | null;
					id: number;
					operator_id: string | null;
					received_at: string | null;
					sinch_id: string | null;
					to: string | null;
					type: string | null;
				};
				Insert: {
					body?: string | null;
					created_at?: string;
					from?: string | null;
					id?: number;
					operator_id?: string | null;
					received_at?: string | null;
					sinch_id?: string | null;
					to?: string | null;
					type?: string | null;
				};
				Update: {
					body?: string | null;
					created_at?: string;
					from?: string | null;
					id?: number;
					operator_id?: string | null;
					received_at?: string | null;
					sinch_id?: string | null;
					to?: string | null;
					type?: string | null;
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
