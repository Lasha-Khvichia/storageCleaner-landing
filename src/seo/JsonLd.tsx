import { serializeJsonLd } from "./json-ld";

/** Renders one structured-data block. Not executed by the browser, so the CSP is unaffected. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
