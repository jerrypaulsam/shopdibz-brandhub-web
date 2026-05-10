import ProductWorkspaceLayout from "@/src/components/product/ProductWorkspaceLayout";
import ShipRatePanel from "@/src/components/product/ShipRatePanel";
import { useShipRateList } from "@/src/hooks/product/useShipRateList";

export default function ShippingRatesPage() {
  const shipping = useShipRateList();

  return (
    <ProductWorkspaceLayout
      title="Shipping Rates"
      subtitle="Check shipping cost estimates in a dedicated web calculator instead of a transient dialog."
      message={shipping.error}
    >
      <ShipRatePanel
        form={shipping.form}
        result={shipping.result}
        isSubmitting={shipping.isSubmitting}
        setFormField={shipping.setFormField}
        submit={shipping.submit}
      />
    </ProductWorkspaceLayout>
  );
}
