-- Add show_on_home flag for homepage visibility
ALTER TABLE "ProjectsCatalog"
ADD COLUMN "show_on_home" BOOLEAN NOT NULL DEFAULT false;

-- Backfill existing projects so they continue to appear on home by default
UPDATE "ProjectsCatalog" SET "show_on_home" = true;
