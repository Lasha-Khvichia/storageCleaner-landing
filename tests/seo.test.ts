import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FAQ } from "../src/content/faq.ts";
import { buildFaqPage, buildSoftwareApplication, serializeJsonLd } from "../src/seo/json-ld.ts";
import { DEFAULT_SITE_URL, parseSiteUrl } from "../src/seo/site-url.ts";
import { sampleRelease } from "./sample-release.ts";

describe("parseSiteUrl", () => {
  it("accepts a plain https origin", () => {
    assert.equal(parseSiteUrl("https://example.com"), "https://example.com");
  });
  it("falls back for unset, http, trailing slash, path and garbage", () => {
    for (const bad of [undefined, "", "http://example.com", "https://example.com/", "https://example.com/a", "nope"]) {
      assert.equal(parseSiteUrl(bad), DEFAULT_SITE_URL);
    }
  });
});

describe("JSON-LD", () => {
  it("escapes < so data cannot close the script tag", () => {
    const out = serializeJsonLd({ text: "</script><b>" });
    assert.ok(!out.includes("<"));
    assert.equal((JSON.parse(out) as { text: string }).text, "</script><b>");
  });
  it("builds SoftwareApplication with release fields", () => {
    const app = buildSoftwareApplication("https://example.com", sampleRelease());
    assert.equal(app["@type"], "SoftwareApplication");
    assert.equal(app.softwareVersion, "1.2.3");
    assert.equal(app.datePublished, "2026-11-01T10:00:00.000Z");
    assert.equal(app.downloadUrl, "https://example.com/downloads/app-setup.exe");
    assert.equal(app.image, "https://example.com/opengraph-image");
  });
  it("omits release fields without a release", () => {
    const app = buildSoftwareApplication("https://example.com", null);
    for (const key of ["softwareVersion", "datePublished", "downloadUrl"]) assert.ok(!(key in app));
    assert.deepEqual(app.offers, { "@type": "Offer", price: 0, priceCurrency: "USD" });
  });
  it("builds FAQPage from the FAQ content", () => {
    const page = buildFaqPage() as { mainEntity: { name: string }[] };
    assert.deepEqual(page.mainEntity.map((q) => q.name), FAQ.map((f) => f.question));
  });
});
