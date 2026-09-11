import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ChoiceGroup } from "./choice-group/choice-group";
import { EmbedFrame } from "./embed-frame/embed-frame";
import { FeatureBenefit } from "./feature-benefit/feature-benefit";
import { HeroBlock } from "./hero-block/hero-block";
import { HowtoBlock } from "./howto-block/howto-block";
import { OriginStory } from "./origin-story/origin-story";
import { PersonProfile } from "./person-profile/person-profile";
import { ProofCard } from "./proof-card/proof-card";
import { PublishingPath } from "./publishing-path/publishing-path";
import { ScopePicker } from "./scope-picker/scope-picker";

import type { ReactElement } from "react";

/**
 * F-2-33 — every self-badging component hands its `locale` on.
 *
 * `demo-data-badge`, `placeholder-badge` and `placeholder-surface` read the
 * dictionary and default to German, which is right: German is the default
 * locale. The defect was never in the badges — it was in the components
 * *around* them, which own a `locale` (or could) and rendered the badge
 * without it, so an English page badged "Demo-Daten", "Foto gesucht" and
 * "Nicht motivgenau · Platzhalter". The page walk that catches the same leak
 * one level up is `e2e/english-ui-strings.spec.ts`.
 *
 * Each case below is rendered exactly in the state that makes its badge
 * appear — a missing photo, a photo that does not depict its claim, a mocked
 * payload — because a component with no badge on screen proves nothing.
 */

/** The three strings F-2-33's gate-2 retest measured on the `/en` routes. */
const GERMAN_BADGES = ["Demo-Daten", "Foto gesucht", "Nicht motivgenau"];

const CASES: ReadonlyArray<readonly [string, () => ReactElement]> = [
  [
    "hero-block — no photograph, so the hatch badges the section",
    () => <HeroBlock headline="What is on where you live" id="focus-block" locale="en" />,
  ],
  [
    "hero-block — a photograph that does not depict its claim",
    () => <HeroBlock
      headline="What is on where you live"
      id="focus-block"
      locale="en"
      notDepicting
      src="/placeholders/hero.svg"
    />,
  ],
  [
    "proof-card — an image slot with no cleared asset behind it",
    () => <ProofCard
      attribution="Example County"
      claim="Everything in one calendar."
      contextLine="Example feedback"
      geo={{ level: "region", label: "Example region" }}
      image={{ alt: "" }}
      locale="en"
    />,
  ],
  [
    "proof-card — a mocked payload",
    () => <ProofCard
      attribution="Example County"
      claim="Everything in one calendar."
      contextLine="Example feedback"
      geo={{ level: "region", label: "Example region" }}
      locale="en"
      state="mocked"
    />,
  ],
  [
    "publishing-path — a step image that has not been shot yet",
    () => <PublishingPath
      headline="Publish by WhatsApp"
      locale="en"
      mechanism="whatsapp"
      mediaState="empty"
      steps={[{ index: 1, title: "Send the date", body: "One message is enough." }]}
    />,
  ],
  [
    "origin-story — a portrait that does not depict the founder",
    () => <OriginStory
      body="A village of around 400 people built itself a free community calendar."
      locale="en"
      portraitAlt="Founder"
      portraitNotDepicting
      portraitSrc="/placeholders/portrait.svg"
      priceDisplay="priced"
      priceFigure={{ amount: 480, currency: "EUR", interval: "year" }}
    />,
  ],
  [
    "person-profile — a person with no usable portrait",
    () => <PersonProfile locale="en" name="Example Person" portraitAlt="Example Person" role="Founder" />,
  ],
  [
    "howto-block — no screenshots on file",
    () => <HowtoBlock
      android={{ steps: ["Open the menu"] }}
      appHref="https://example.org/example-place"
      headline="Put it on your home screen"
      ios={{ steps: ["Open the share sheet"] }}
      locale="en"
    />,
  ],
  [
    "feature-benefit — a media slot with no asset",
    () => <FeatureBenefit
      benefit="Your whole territory in one calendar."
      feature="Territory cut"
      locale="en"
      mediaState="empty"
    />,
  ],
  [
    "embed-frame — the mocked widget mount",
    () => <EmbedFrame heading="This is what the embed looks like" locale="en" state="mocked" />,
  ],
  [
    "choice-group — the mocked step-2 vocabulary",
    () => <ChoiceGroup
      legend="Who publishes?"
      locale="en"
      name="wer"
      options={[{ value: "verein", label: "A club" }]}
      state="mocked"
      submitLabel="Continue"
      to="register"
    />,
  ],
  [
    "scope-picker — mocked demo chips",
    () => <ScopePicker
      items={[
        { id: "example", label: "Example place", kind: "place", removeQuery: {} },
      ]}
      locale="en"
      state="mocked"
      to="order"
    />,
  ],
];

describe("F-2-33: no component badges an English page in German", () => {
  for (const [name, render] of CASES) {
    it(name, () => {
      const html = renderToStaticMarkup(render());
      for (const german of GERMAN_BADGES) {
        expect(html, `${name} renders "${german}"`).not.toContain(german);
      }
    });
  }
});

describe("F-2-33: choice-group's own empty state is a dictionary string, not a literal", () => {
  it("says it in English on an English page", () => {
    const html = renderToStaticMarkup(
      <ChoiceGroup legend="Who publishes?" locale="en" name="wer" options={[]} to="register" />,
    );
    expect(html).not.toContain("Keine Auswahl verfügbar.");
  });

  it("still says it in German on a German page", () => {
    const html = renderToStaticMarkup(
      <ChoiceGroup legend="Wer veröffentlicht?" locale="de" name="wer" options={[]} to="register" />,
    );
    expect(html).toContain("Keine Auswahl verfügbar.");
  });
});
