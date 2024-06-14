import {
  createIntegration,
  createComponent,
  RuntimeEnvironment,
  RuntimeContext,
} from "@gitbook/runtime";

import { extractGuideParamsFromURL, fetchAspectRatio } from "./guidejar";

interface GuidejarInstallationConfiguration {}

type GuidejarRuntimeEnvironment =
  RuntimeEnvironment<GuidejarInstallationConfiguration>;
type GuidejarRuntimeContext = RuntimeContext<GuidejarRuntimeEnvironment>;

/**
 * Component to render the block when embeding an Guidejar URL.
 */
const embedBlock = createComponent<{
  guideId?: string;
  url?: string;
}>({
  componentId: "embed",

  async action(element, action) {
    //console.log("action", action);
    switch (action.action) {
      case "@link.unfurl": {
        const { url } = action;
        const nodeProps = extractGuideParamsFromURL(url);

        return {
          props: {
            ...nodeProps,
            url,
          },
        };
      }
    }

    return element;
  },

  async render(element, context) {
    const { environment } = context;
    const { guideId, type, controls, url } = element.props;
    if (!guideId) {
      return (
        <block>
          <card
            title={"Guidejar"}
            onPress={{
              action: "@ui.url.open",
              url,
            }}
            icon={
              <image
                source={{
                  url: environment.integration.urls.icon,
                }}
                aspectRatio={1}
              />
            }
          />
        </block>
      );
    }

    const aspectRatio = (await fetchAspectRatio(guideId)) ?? 16 / 9;

    return (
      <block>
        <webframe
          source={{
            url: `https://www.guidejar.com/embed/${guideId}?type=${type}&controls=${
              controls != null && controls?.trim()
                ? controls
                : environment.installation?.configuration?.controls
                ? "on"
                : "off"
            }`,
          }}
          aspectRatio={
            type == 1 ? +parseFloat(aspectRatio + "").toFixed(2) : 9 / 16
          }
        />
      </block>
    );
  },
});

export default createIntegration<GuidejarRuntimeContext>({
  components: [embedBlock],
});
