import ErrorStatePage from "@/src/components/app/ErrorStatePage";

export default function Custom500Page() {
  return (
    <ErrorStatePage
      code="500"
      title="Something went wrong on our side."
      description="We hit a server issue while loading this page. Please refresh or return to the dashboard and try again in a moment."
      primaryAction={{ href: "/home", label: "Open Dashboard" }}
      secondaryAction={{ href: "/", label: "Go to Brand Hub" }}
    />
  );
}
