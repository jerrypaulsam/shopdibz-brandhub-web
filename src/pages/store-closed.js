import ErrorStatePage from "@/src/components/app/ErrorStatePage";

export default function StoreClosedPage() {
  return (
    <ErrorStatePage
      code="Store Closed"
      title="This store is currently closed."
      description="Access to the seller workspace is unavailable while the store remains closed. Please contact Shopdibz support if this was not expected."
      primaryAction={{ href: "/", label: "Go to Brand Hub" }}
      secondaryAction={{ href: "https://www.shopdibz.com/contact", label: "Contact Support", external: true }}
    />
  );
}
