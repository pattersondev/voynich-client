import Landing from "@/components/landing";
import Script from "next/script";

export default function Home() {
  return (
    <main>
      <Landing />
      <Script id="structured-data" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Voynich",
            "applicationCategory": "CommunicationApplication",
            "operatingSystem": "Web",
            "description": "Voynich is a secure, encrypted, and ephemeral messaging application for private conversations.",
            "offers": {
              "@type": "Offer",
              "price": "0"
            }
          }
        `}
      </Script>
    </main>
  );
}
