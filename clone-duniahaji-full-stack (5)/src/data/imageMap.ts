// Image mapping from duniahaji.com product IDs to GitHub-hosted images
// The numbers in filenames correspond to product IDs from duniahaji.com

const BASE1 = "https://raw.githubusercontent.com/daudqwery/ramdani-barokah/main/duniahaji.com_04765391-3546-4187-a1a3-164114864fda";
const BASE2 = "https://raw.githubusercontent.com/daudqwery/ramdani-barokah/main/duniahaji.com_5f0ca7ac-2846-4aae-9f2e-9bb709c43c8e";

// Map: duniahaji product ID → GitHub image URL
export const imageMap: Record<number, string> = {
  // Folder 1 (04765391)
  39:  `${BASE1}/20251027-039-d147f109-9da9-45ba-a549-9684c6744c9f.webp`,
  42:  `${BASE1}/20251027-042-00c760cc-564b-460c-bc85-a31ead32ab41.webp`,
  91:  `${BASE1}/20251027-091-4b1b74d0-309d-4c1a-a715-240425d4ac63.webp`,
  141: `${BASE1}/20251027-141-f5aa07d7-c195-4f3f-a4b3-8c4143f4ac1d.webp`,
  161: `${BASE1}/20251027-161-bb7e21a0-c23b-49f4-90ab-35b7c7720e51.webp`,
  162: `${BASE1}/20251027-162-ae775960-e5cf-41b9-80dd-01749404e84c.webp`,
  182: `${BASE1}/20251028-182-aecf6ebd-527d-4a78-9b70-5e5e3b56c300.webp`,
  185: `${BASE1}/20251028-185-5ba61ff6-3877-443e-9bbf-0f6b78163f67.webp`,
  204: `${BASE1}/20251028-204-7894cb00-c125-4b4a-a1ea-5b8ed3a7f63c.webp`,
  210: `${BASE1}/20251028-210-fd5a4f90-cd88-4e69-b537-83dd90742680.webp`,
  227: `${BASE1}/20251028-227-eeed8532-20d9-4c03-9189-def23d85bd29.webp`,
  243: `${BASE1}/20251028-243-0c7014b9-99d1-4660-bcc9-b893b342b7c2.webp`,
  267: `${BASE1}/20251028-267-bd51c4e3-e40e-452b-b658-e14948067357.webp`,
  275: `${BASE1}/20251028-275-8d24d3a9-b6bd-4839-85d2-8ddbe7fb85b3.webp`,
  285: `${BASE1}/20251028-285-098c8a45-e048-4f9c-9a99-86d3b5288afd.webp`,
  300: `${BASE1}/20251028-300-58dba17b-fb2d-4df3-a2a4-7db71656730e.webp`,
  315: `${BASE1}/20251029-315-c121065e-aa45-4c38-9b09-0679deeeae8d.webp`,
  318: `${BASE1}/20251029-318-93483727-908c-4ca1-9cb5-b1cf161e782e.webp`,
  322: `${BASE1}/20251029-322-0e9fed8d-aaf1-48a3-8265-739468c7748d.webp`,
  405: `${BASE1}/20251029-405-64a6e388-7ef1-4e59-a267-cecf43824540.webp`,
  409: `${BASE1}/20251029-409-441d75e8-014c-46e8-98f0-53b402ac1646.webp`,
  455: `${BASE1}/20251029-455-f153e8da-5638-404d-a743-64c698ff8b8b.webp`,

  // Folder 2 (5f0ca7ac)
  45:  `${BASE2}/20251027-045-9ad964ea-e97b-476c-bf7d-faee1ee6c69c.webp`,
  80:  `${BASE2}/20251027-080-fce4e888-2a93-4b40-88fc-3f153501fe19.webp`,
  94:  `${BASE2}/20251027-094-2a2bab31-6544-46df-89ed-f634e2cf6cc2.webp`,
  98:  `${BASE2}/20251027-098-6f28415f-1798-4098-834c-2c21547e4ae6.webp`,
  105: `${BASE2}/20251027-105-9406ff67-9b64-4b3f-bf51-2098e93e9868.webp`,
  113: `${BASE2}/20251027-113-f7bbeeb6-e476-4ba8-a3d9-aea87d5a453c.webp`,
};

// Get image URL for a product, with fallback
export function getProductImage(sourceId: number | undefined, fallback: string): string {
  if (sourceId && imageMap[sourceId]) {
    return imageMap[sourceId];
  }
  return fallback;
}
