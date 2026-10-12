CREATE TYPE "public"."page_status" AS ENUM('active', 'needs_reconnect');--> statement-breakpoint
CREATE TABLE "facebook_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"fb_user_id" text NOT NULL,
	"name" text NOT NULL,
	"token_encrypted" text NOT NULL,
	"token_expires_at" timestamp with time zone,
	"connected_by" uuid,
	"last_synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "facebook_accounts_workspace_fb_user_key" UNIQUE("workspace_id","fb_user_id")
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"facebook_account_id" uuid NOT NULL,
	"fb_page_id" text NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"token_encrypted" text NOT NULL,
	"tasks" text[] DEFAULT '{}' NOT NULL,
	"status" "page_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_workspace_fb_page_key" UNIQUE("workspace_id","fb_page_id")
);
--> statement-breakpoint
ALTER TABLE "facebook_accounts" ADD CONSTRAINT "facebook_accounts_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facebook_accounts" ADD CONSTRAINT "facebook_accounts_connected_by_users_id_fk" FOREIGN KEY ("connected_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_facebook_account_id_facebook_accounts_id_fk" FOREIGN KEY ("facebook_account_id") REFERENCES "public"."facebook_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pages_facebook_account_id_idx" ON "pages" USING btree ("facebook_account_id");