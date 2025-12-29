-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('ru', 'kk', 'en');

-- CreateEnum
CREATE TYPE "CatalogProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CatalogMediaType" AS ENUM ('GALLERY_IMAGE', 'FLOOR_PLAN', 'FACADE', 'VIDEO_THUMBNAIL', 'VIDEO_FILE');

-- CreateEnum
CREATE TYPE "CatalogBulletType" AS ENUM ('STRUCTURAL_CONCEPT', 'WHO_FOR', 'PRICE_INCLUDES');

-- CreateTable
CREATE TABLE "ProjectsCatalog" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "status" "CatalogProjectStatus" NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "area_m2" DECIMAL(10,2) NOT NULL,
    "floors" INTEGER NOT NULL,
    "bedrooms" INTEGER,
    "price_amount" BIGINT NOT NULL,
    "price_currency" CHAR(3) NOT NULL DEFAULT 'KZT',
    "style_id" UUID,
    "material_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_catalog_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsCatalogTranslation" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "characteristics" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "implementation_text" TEXT NOT NULL,
    "timeline_design_phase_value" TEXT NOT NULL,
    "timeline_construction_value" TEXT NOT NULL,
    "timeline_full_cycle_value" TEXT NOT NULL,
    "video_title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_catalog_project_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsCatalogStyle" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_catalog_styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsCatalogStyleTranslation" (
    "id" UUID NOT NULL,
    "style_id" UUID NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_catalog_style_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsCatalogMaterial" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_catalog_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsCatalogMaterialTranslation" (
    "id" UUID NOT NULL,
    "material_id" UUID NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_catalog_material_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsCatalogConstructionMaterial" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_catalog_construction_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsCatalogConstructionMaterialTranslation" (
    "id" UUID NOT NULL,
    "material_id" UUID NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_catalog_construction_material_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsCatalogProjectConstructionMaterial" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "material_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "projects_catalog_project_construction_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsCatalogMedia" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "type" "CatalogMediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT,
    "duration_seconds" INTEGER,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_catalog_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsCatalogBullet" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "type" "CatalogBulletType" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_catalog_bullets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsCatalogBulletTranslation" (
    "id" UUID NOT NULL,
    "bullet_id" UUID NOT NULL,
    "locale" "Locale" NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_catalog_bullet_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_catalog_projects_code_key" ON "ProjectsCatalog"("code");

-- CreateIndex
CREATE INDEX "projects_catalog_projects_status_idx" ON "ProjectsCatalog"("status");

-- CreateIndex
CREATE INDEX "projects_catalog_projects_featured_idx" ON "ProjectsCatalog"("featured");

-- CreateIndex
CREATE INDEX "projects_catalog_projects_floors_idx" ON "ProjectsCatalog"("floors");

-- CreateIndex
CREATE INDEX "projects_catalog_projects_area_m2_idx" ON "ProjectsCatalog"("area_m2");

-- CreateIndex
CREATE INDEX "projects_catalog_projects_price_amount_idx" ON "ProjectsCatalog"("price_amount");

-- CreateIndex
CREATE INDEX "projects_catalog_projects_style_id_idx" ON "ProjectsCatalog"("style_id");

-- CreateIndex
CREATE INDEX "projects_catalog_projects_material_id_idx" ON "ProjectsCatalog"("material_id");

-- CreateIndex
CREATE INDEX "projects_catalog_project_translations_locale_idx" ON "ProjectsCatalogTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "projects_catalog_project_translations_project_id_locale_key" ON "ProjectsCatalogTranslation"("project_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "projects_catalog_styles_code_key" ON "ProjectsCatalogStyle"("code");

-- CreateIndex
CREATE INDEX "projects_catalog_style_translations_locale_idx" ON "ProjectsCatalogStyleTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "projects_catalog_style_translations_style_id_locale_key" ON "ProjectsCatalogStyleTranslation"("style_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "projects_catalog_materials_code_key" ON "ProjectsCatalogMaterial"("code");

-- CreateIndex
CREATE INDEX "projects_catalog_material_translations_locale_idx" ON "ProjectsCatalogMaterialTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "projects_catalog_material_translations_material_id_locale_key" ON "ProjectsCatalogMaterialTranslation"("material_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "projects_catalog_construction_materials_code_key" ON "ProjectsCatalogConstructionMaterial"("code");

-- CreateIndex
CREATE INDEX "projects_catalog_construction_material_translations_locale_idx" ON "ProjectsCatalogConstructionMaterialTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "projects_catalog_construction_material_translations_materia_key" ON "ProjectsCatalogConstructionMaterialTranslation"("material_id", "locale");

-- CreateIndex
CREATE INDEX "projects_catalog_project_construction_materials_project_id__idx" ON "ProjectsCatalogProjectConstructionMaterial"("project_id", "sort_order");

-- CreateIndex
CREATE INDEX "projects_catalog_project_construction_materials_material_id_idx" ON "ProjectsCatalogProjectConstructionMaterial"("material_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_catalog_project_construction_materials_project_id__key" ON "ProjectsCatalogProjectConstructionMaterial"("project_id", "material_id");

-- CreateIndex
CREATE INDEX "projects_catalog_media_project_id_idx" ON "ProjectsCatalogMedia"("project_id");

-- CreateIndex
CREATE INDEX "projects_catalog_media_project_id_type_idx" ON "ProjectsCatalogMedia"("project_id", "type");

-- CreateIndex
CREATE INDEX "projects_catalog_media_type_idx" ON "ProjectsCatalogMedia"("type");

-- CreateIndex
CREATE INDEX "projects_catalog_media_project_id_type_sort_order_idx" ON "ProjectsCatalogMedia"("project_id", "type", "sort_order");

-- CreateIndex
CREATE INDEX "projects_catalog_bullets_project_id_type_idx" ON "ProjectsCatalogBullet"("project_id", "type");

-- CreateIndex
CREATE INDEX "projects_catalog_bullets_project_id_type_sort_order_idx" ON "ProjectsCatalogBullet"("project_id", "type", "sort_order");

-- CreateIndex
CREATE INDEX "projects_catalog_bullet_translations_locale_idx" ON "ProjectsCatalogBulletTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "projects_catalog_bullet_translations_bullet_id_locale_key" ON "ProjectsCatalogBulletTranslation"("bullet_id", "locale");

-- AddForeignKey
ALTER TABLE "ProjectsCatalog" ADD CONSTRAINT "projects_catalog_projects_style_id_fkey" FOREIGN KEY ("style_id") REFERENCES "ProjectsCatalogStyle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsCatalog" ADD CONSTRAINT "projects_catalog_projects_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "ProjectsCatalogMaterial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsCatalogTranslation" ADD CONSTRAINT "projects_catalog_project_translations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "ProjectsCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsCatalogStyleTranslation" ADD CONSTRAINT "projects_catalog_style_translations_style_id_fkey" FOREIGN KEY ("style_id") REFERENCES "ProjectsCatalogStyle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsCatalogMaterialTranslation" ADD CONSTRAINT "projects_catalog_material_translations_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "ProjectsCatalogMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsCatalogConstructionMaterialTranslation" ADD CONSTRAINT "projects_catalog_construction_material_translations_materi_fkey" FOREIGN KEY ("material_id") REFERENCES "ProjectsCatalogConstructionMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsCatalogProjectConstructionMaterial" ADD CONSTRAINT "projects_catalog_project_construction_materials_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "ProjectsCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsCatalogProjectConstructionMaterial" ADD CONSTRAINT "projects_catalog_project_construction_materials_material_i_fkey" FOREIGN KEY ("material_id") REFERENCES "ProjectsCatalogConstructionMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsCatalogMedia" ADD CONSTRAINT "projects_catalog_media_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "ProjectsCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsCatalogBullet" ADD CONSTRAINT "projects_catalog_bullets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "ProjectsCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsCatalogBulletTranslation" ADD CONSTRAINT "projects_catalog_bullet_translations_bullet_id_fkey" FOREIGN KEY ("bullet_id") REFERENCES "ProjectsCatalogBullet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
