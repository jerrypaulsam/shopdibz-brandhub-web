import ErrorStatePage from "@/src/components/app/ErrorStatePage";

function ErrorPage({ statusCode }) {
  const code = Number(statusCode || 500);
  const isNotFound = code === 404;

  return (
    <ErrorStatePage
      code={String(code)}
      title={isNotFound ? "This page could not be found." : "Something interrupted this page."}
      description={
        isNotFound
          ? "The resource you requested is unavailable or may have been moved."
          : "An unexpected error occurred while rendering this page. Please try again or return to the dashboard."
      }
      primaryAction={{ href: isNotFound ? "/" : "/home", label: isNotFound ? "Go to Brand Hub" : "Open Dashboard" }}
      secondaryAction={{ href: "https://www.shopdibz.com/contact", label: "Contact Support", external: true }}
    />
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 500;
  return { statusCode };
};

export default ErrorPage;
