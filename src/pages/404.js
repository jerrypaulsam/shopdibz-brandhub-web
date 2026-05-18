import ErrorStatePage from "@/src/components/app/ErrorStatePage";

export default function Custom404Page() {
  return (
    <ErrorStatePage
      code="404"
      title="This page could not be found."
      description="The link may be outdated, or the page may have moved. You can head back to the Brand Hub and continue from there."
      primaryAction={{ href: "/", label: "Go to Brand Hub" }}
      secondaryAction={{ href: "/home", label: "Open Dashboard" }}
    />
  );
}
