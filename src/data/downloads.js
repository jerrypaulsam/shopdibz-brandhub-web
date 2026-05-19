function buildDownloadPath(id) {
  return `/api/downloads/${id}`;
}

export const DOWNLOAD_SOURCE_ITEMS = {
  "bulk-listing-without-variant-template": {
    label: "Bulk Listing Without Variation",
    filename: "bulkcreatenew.xlsm",
    sourceUrl:
      "https://shopdibz-main-1.s3.ap-south-1.amazonaws.com/Bulk+create+Template/bulkcreatenew.xlsm",
  },
  "bulk-listing-with-variant-template": {
    label: "Bulk Listing With Variation",
    filename: "bulkcreate_withVariation.xlsm",
    sourceUrl:
      "https://shopdibz-main-1.s3.ap-south-1.amazonaws.com/Bulk+create+Template/bulkcreate_withVariation.xlsm",
  },
  "bulk-update-product-attributes-template": {
    label: "Bulk Update Product Attributes",
    filename: "bulkUpdatewVar.xlsx",
    sourceUrl:
      "https://shopdibz-main-1.s3.ap-south-1.amazonaws.com/Bulk+create+Template/bulkUpdatewVar.xlsx",
  },
  "bulk-update-variation-attributes-template": {
    label: "Bulk Update Variation Attributes",
    filename: "bulkUpdatewithVar.xlsx",
    sourceUrl:
      "https://shopdibz-main-1.s3.ap-south-1.amazonaws.com/Bulk+create+Template/bulkUpdatewithVar.xlsx",
  },
  "product-offer-groups-template": {
    label: "Template for Product/Offer Groups",
    filename: "ProductCodeAdd.xlsx",
    sourceUrl:
      "https://shopdibz-main-1.s3.ap-south-1.amazonaws.com/Bulk+create+Template/ProductCodeAdd.xlsx",
  },
  "featured-products-template": {
    label: "Template For Featured Products",
    filename: "ProductCodeAdd.xlsx",
    sourceUrl:
      "https://shopdibz-main-1.s3.ap-south-1.amazonaws.com/Bulk+create+Template/ProductCodeAdd.xlsx",
  },
  "bulk-listing-without-variant-sample": {
    label: "Example Bulk Listing Without Variation",
    filename: "sampleCreate.xlsm",
    sourceUrl:
      "https://shopdibz-main-1.s3.ap-south-1.amazonaws.com/Bulk+create+Template/sampleCreate.xlsm",
  },
  "bulk-listing-with-variant-sample": {
    label: "Example Bulk Listing With Variation",
    filename: "sampleCreate_withVariation.xlsm",
    sourceUrl:
      "https://shopdibz-main-1.s3.ap-south-1.amazonaws.com/Bulk+create+Template/sampleCreate_withVariation.xlsm",
  },
};

export const DOWNLOAD_ITEMS = Object.entries(DOWNLOAD_SOURCE_ITEMS).map(
  ([id, item]) => ({
    id,
    label: item.label,
    href: buildDownloadPath(id),
  }),
);

export const PRODUCT_BULK_TEMPLATE_URLS = {
  create: {
    "without-variant": buildDownloadPath(
      "bulk-listing-without-variant-template",
    ),
    "with-variant": buildDownloadPath("bulk-listing-with-variant-template"),
  },
  sample: {
    "without-variant": buildDownloadPath("bulk-listing-without-variant-sample"),
    "with-variant": buildDownloadPath("bulk-listing-with-variant-sample"),
  },
};
