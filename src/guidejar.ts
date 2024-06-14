export interface GuidejarOEmbed {
  type: "rich";
  title: string;
  width: number;
  height: number;
}

/**
 * Fetch the Guidejar oembed data.
 */
export async function fetchAspectRatio(guideId: string): Promise<number> {
  try {
    const response = await fetch(`https://www.guidejar.com/guides/${guideId}`);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const aspectRatio = getIframelyAspectRatio(html);
    return aspectRatio;
  } catch (e) {
    console.log(e);
  }
}

function getIframelyAspectRatio(html) {
  const regex =
    /<link\s+rel="iframely"[^>]*media="\(aspect-ratio:\s*([\d.]+)\)"/;
  const match = html.match(regex);
  return match ? match[1] : null;
}

/**
 * Extract the Guidejar flow ID from the embed URL.
 */
export function extractGuideParamsFromURL(input: string): {
  guideId?: string;
  type?: string;
  controls?: string;
} {
  const url = new URL(input);
  // if (!["guidejar.com", "guidejar.xyz"].includes(url.hostname)) {
  //   return;
  // }

  const parts = url.pathname.split("/");
  if (!["guides", "embed"].includes(parts[1])) {
    return;
  }

  return {
    guideId: parts[2],
    type: url.searchParams?.has("type") ? url.searchParams.get("type") : 1,
    controls: url.searchParams.get("controls"),
  };
}
