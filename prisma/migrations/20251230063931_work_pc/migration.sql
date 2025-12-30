-- AlterTable
ALTER TABLE "ProjectsCatalog" RENAME CONSTRAINT "projects_catalog_projects_pkey" TO "ProjectsCatalog_pkey";

-- AlterTable
ALTER TABLE "ProjectsCatalogBullet" RENAME CONSTRAINT "projects_catalog_bullets_pkey" TO "ProjectsCatalogBullet_pkey";

-- AlterTable
ALTER TABLE "ProjectsCatalogBulletTranslation" RENAME CONSTRAINT "projects_catalog_bullet_translations_pkey" TO "ProjectsCatalogBulletTranslation_pkey";

-- AlterTable
ALTER TABLE "ProjectsCatalogConstructionMaterial" RENAME CONSTRAINT "projects_catalog_construction_materials_pkey" TO "ProjectsCatalogConstructionMaterial_pkey";

-- AlterTable
ALTER TABLE "ProjectsCatalogConstructionMaterialTranslation" RENAME CONSTRAINT "projects_catalog_construction_material_translations_pkey" TO "ProjectsCatalogConstructionMaterialTranslation_pkey";

-- AlterTable
ALTER TABLE "ProjectsCatalogMaterial" RENAME CONSTRAINT "projects_catalog_materials_pkey" TO "ProjectsCatalogMaterial_pkey";

-- AlterTable
ALTER TABLE "ProjectsCatalogMaterialTranslation" RENAME CONSTRAINT "projects_catalog_material_translations_pkey" TO "ProjectsCatalogMaterialTranslation_pkey";

-- AlterTable
ALTER TABLE "ProjectsCatalogMedia" RENAME CONSTRAINT "projects_catalog_media_pkey" TO "ProjectsCatalogMedia_pkey";

-- AlterTable
ALTER TABLE "ProjectsCatalogProjectConstructionMaterial" RENAME CONSTRAINT "projects_catalog_project_construction_materials_pkey" TO "ProjectsCatalogProjectConstructionMaterial_pkey";

-- AlterTable
ALTER TABLE "ProjectsCatalogStyle" RENAME CONSTRAINT "projects_catalog_styles_pkey" TO "ProjectsCatalogStyle_pkey";

-- AlterTable
ALTER TABLE "ProjectsCatalogStyleTranslation" RENAME CONSTRAINT "projects_catalog_style_translations_pkey" TO "ProjectsCatalogStyleTranslation_pkey";

-- AlterTable
ALTER TABLE "ProjectsCatalogTranslation" RENAME CONSTRAINT "projects_catalog_project_translations_pkey" TO "ProjectsCatalogTranslation_pkey";

-- RenameForeignKey
ALTER TABLE "ProjectsCatalog" RENAME CONSTRAINT "projects_catalog_projects_material_id_fkey" TO "ProjectsCatalog_material_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProjectsCatalog" RENAME CONSTRAINT "projects_catalog_projects_style_id_fkey" TO "ProjectsCatalog_style_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProjectsCatalogBullet" RENAME CONSTRAINT "projects_catalog_bullets_project_id_fkey" TO "ProjectsCatalogBullet_project_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProjectsCatalogBulletTranslation" RENAME CONSTRAINT "projects_catalog_bullet_translations_bullet_id_fkey" TO "ProjectsCatalogBulletTranslation_bullet_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProjectsCatalogConstructionMaterialTranslation" RENAME CONSTRAINT "projects_catalog_construction_material_translations_materi_fkey" TO "ProjectsCatalogConstructionMaterialTranslation_material_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProjectsCatalogMaterialTranslation" RENAME CONSTRAINT "projects_catalog_material_translations_material_id_fkey" TO "ProjectsCatalogMaterialTranslation_material_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProjectsCatalogMedia" RENAME CONSTRAINT "projects_catalog_media_project_id_fkey" TO "ProjectsCatalogMedia_project_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProjectsCatalogProjectConstructionMaterial" RENAME CONSTRAINT "projects_catalog_project_construction_materials_material_i_fkey" TO "ProjectsCatalogProjectConstructionMaterial_material_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProjectsCatalogProjectConstructionMaterial" RENAME CONSTRAINT "projects_catalog_project_construction_materials_project_id_fkey" TO "ProjectsCatalogProjectConstructionMaterial_project_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProjectsCatalogStyleTranslation" RENAME CONSTRAINT "projects_catalog_style_translations_style_id_fkey" TO "ProjectsCatalogStyleTranslation_style_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProjectsCatalogTranslation" RENAME CONSTRAINT "projects_catalog_project_translations_project_id_fkey" TO "ProjectsCatalogTranslation_project_id_fkey";

-- RenameIndex
ALTER INDEX "projects_catalog_projects_area_m2_idx" RENAME TO "ProjectsCatalog_area_m2_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_projects_code_key" RENAME TO "ProjectsCatalog_code_key";

-- RenameIndex
ALTER INDEX "projects_catalog_projects_featured_idx" RENAME TO "ProjectsCatalog_featured_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_projects_floors_idx" RENAME TO "ProjectsCatalog_floors_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_projects_material_id_idx" RENAME TO "ProjectsCatalog_material_id_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_projects_price_amount_idx" RENAME TO "ProjectsCatalog_price_amount_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_projects_status_idx" RENAME TO "ProjectsCatalog_status_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_projects_style_id_idx" RENAME TO "ProjectsCatalog_style_id_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_bullets_project_id_type_idx" RENAME TO "ProjectsCatalogBullet_project_id_type_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_bullets_project_id_type_sort_order_idx" RENAME TO "ProjectsCatalogBullet_project_id_type_sort_order_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_bullet_translations_bullet_id_locale_key" RENAME TO "ProjectsCatalogBulletTranslation_bullet_id_locale_key";

-- RenameIndex
ALTER INDEX "projects_catalog_bullet_translations_locale_idx" RENAME TO "ProjectsCatalogBulletTranslation_locale_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_construction_materials_code_key" RENAME TO "ProjectsCatalogConstructionMaterial_code_key";

-- RenameIndex
ALTER INDEX "projects_catalog_construction_material_translations_locale_idx" RENAME TO "ProjectsCatalogConstructionMaterialTranslation_locale_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_construction_material_translations_materia_key" RENAME TO "ProjectsCatalogConstructionMaterialTranslation_material_id__key";

-- RenameIndex
ALTER INDEX "projects_catalog_materials_code_key" RENAME TO "ProjectsCatalogMaterial_code_key";

-- RenameIndex
ALTER INDEX "projects_catalog_material_translations_locale_idx" RENAME TO "ProjectsCatalogMaterialTranslation_locale_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_material_translations_material_id_locale_key" RENAME TO "ProjectsCatalogMaterialTranslation_material_id_locale_key";

-- RenameIndex
ALTER INDEX "projects_catalog_media_project_id_idx" RENAME TO "ProjectsCatalogMedia_project_id_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_media_project_id_type_idx" RENAME TO "ProjectsCatalogMedia_project_id_type_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_media_project_id_type_sort_order_idx" RENAME TO "ProjectsCatalogMedia_project_id_type_sort_order_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_media_type_idx" RENAME TO "ProjectsCatalogMedia_type_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_project_construction_materials_material_id_idx" RENAME TO "ProjectsCatalogProjectConstructionMaterial_material_id_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_project_construction_materials_project_id__idx" RENAME TO "ProjectsCatalogProjectConstructionMaterial_project_id_sort__idx";

-- RenameIndex
ALTER INDEX "projects_catalog_project_construction_materials_project_id__key" RENAME TO "ProjectsCatalogProjectConstructionMaterial_project_id_mater_key";

-- RenameIndex
ALTER INDEX "projects_catalog_styles_code_key" RENAME TO "ProjectsCatalogStyle_code_key";

-- RenameIndex
ALTER INDEX "projects_catalog_style_translations_locale_idx" RENAME TO "ProjectsCatalogStyleTranslation_locale_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_style_translations_style_id_locale_key" RENAME TO "ProjectsCatalogStyleTranslation_style_id_locale_key";

-- RenameIndex
ALTER INDEX "projects_catalog_project_translations_locale_idx" RENAME TO "ProjectsCatalogTranslation_locale_idx";

-- RenameIndex
ALTER INDEX "projects_catalog_project_translations_project_id_locale_key" RENAME TO "ProjectsCatalogTranslation_project_id_locale_key";
