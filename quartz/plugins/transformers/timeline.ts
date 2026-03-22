import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Element, Root } from "hast"

interface TimelineOptions {
  defaultHeight: string
}

const defaultOptions: TimelineOptions = {
  defaultHeight: "600px",
}

export const Timeline: QuartzTransformerPlugin<Partial<TimelineOptions>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "Timeline",
    htmlPlugins() {
      return [
        () => {
          return (tree: Root, file: any) => {
            const rawSlug = file?.data?.slug ? String(file.data.slug) : "page"
            const safeSlug = rawSlug.toLowerCase().replace(/[^a-z0-9_-]+/g, "-")
            let timelineIndex = 0
            visit(tree, "element", (node: Element, index, parent) => {
              // Look for code blocks with language "timeline"
              if (
                node.tagName === "pre" &&
                node.children?.[0] &&
                (node.children[0] as Element).tagName === "code"
              ) {
                const codeElement = node.children[0] as Element
                const className = (codeElement.properties?.className as string[]) || []

                if (className.some((c) => c.includes("language-timeline"))) {
                  const content = codeElement.children?.[0]
                  if (content && content.type === "text") {
                    const config = parseTimelineConfig(content.value)
                    timelineIndex += 1
                    const timelineId = `timeline-${safeSlug}-${timelineIndex}`

                    // Convert to TimelineJS JSON format
                    const timelineData: Record<string, unknown> = {
                      events: config.events.map((event) => {
                        const evt: Record<string, unknown> = {
                          start_date: {
                            year: event.year,
                            ...(event.month && { month: event.month }),
                            ...(event.day && { day: event.day }),
                          },
                          text: {
                            headline: event.headline,
                            text: event.text || "",
                          },
                        }
                        if (event.endYear) {
                          evt.end_date = { year: event.endYear }
                        }
                        if (event.group) {
                          evt.group = event.group
                        }
                        return evt
                      }),
                    }

                    if (config.title) {
                      timelineData.title = {
                        text: {
                          headline: config.title,
                          text: config.subtitle || "",
                        },
                      }
                    }

                    // Replace code block with timeline container
                    const timelineDiv: Element = {
                      type: "element",
                      tagName: "div",
                      properties: {
                        id: timelineId,
                        className: ["timeline-container"],
                        "data-timeline": JSON.stringify(timelineData),
                        style: `height: ${config.height || opts.defaultHeight}; width: 100%; margin: 1rem 0; background: var(--lightgray); border-radius: 8px;`,
                      },
                      children: [
                        {
                          type: "element",
                          tagName: "p",
                          properties: {
                            style: "text-align: center; padding: 2rem; color: var(--gray);",
                          },
                          children: [{ type: "text", value: "Loading timeline..." }],
                        },
                      ],
                    }

                    if (parent && typeof index === "number") {
                      parent.children[index] = timelineDiv
                    }
                  }
                }
              }
            })
          }
        },
      ]
    },
    externalResources() {
      const initScript = `
        (function () {
          let retryCount = 0;
          const MAX_RETRIES = 25; // ~5s worst case at 200ms
          const RETRY_MS = 200;

          function tryInitTimelines() {
            const containers = document.querySelectorAll(".timeline-container");
            if (!containers.length) return;

            // TimelineJS script can load after this inline script; retry quietly a few times.
            if (typeof TL === "undefined") {
              if (retryCount++ < MAX_RETRIES) {
                setTimeout(tryInitTimelines, RETRY_MS);
              }
              return;
            }

            containers.forEach((container) => {
              if (container.dataset.initialized === "true") return;
              try {
                const dataRaw = container.dataset.timeline || "{}";
                const data = JSON.parse(dataRaw);
                new TL.Timeline(container.id, data, {
                  hash_bookmark: false,
                  initial_zoom: 2,
                  timenav_height_percentage: 30,
                  scale_factor: 2,
                  start_at_end: false,
                });
                container.dataset.initialized = "true";
              } catch (e) {
                const msg = (e && e.message) ? e.message : String(e);
                container.innerHTML =
                  '<p style="color: red; padding: 1rem;">Timeline failed to load: ' + msg + "</p>";
              }
            });
          }

          document.addEventListener("nav", function () {
            setTimeout(tryInitTimelines, 50);
          });

          if (document.readyState === "complete") {
            tryInitTimelines();
          } else {
            window.addEventListener("load", tryInitTimelines);
          }
        })();
      `

      return {
        css: [
          {
            content: "https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css",
            spaPreserve: true,
          },
        ],
        js: [
          {
            src: "https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js",
            loadTime: "beforeDOMReady",
            contentType: "external",
            spaPreserve: true,
          },
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: initScript,
            spaPreserve: true,
          },
        ],
      }
    },
  }
}

interface TimelineEvent {
  year: number
  month?: number
  day?: number
  endYear?: number
  headline: string
  text?: string
  group?: string
}

interface TimelineConfig {
  title?: string
  subtitle?: string
  height?: string
  events: TimelineEvent[]
}

function parseTimelineConfig(content: string): TimelineConfig {
  const config: TimelineConfig = { events: [] }
  const lines = content.trim().split("\n")

  let currentEvent: Partial<TimelineEvent> | null = null

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith("title:")) {
      config.title = trimmed.replace("title:", "").trim().replace(/^"|"$/g, "")
    } else if (trimmed.startsWith("subtitle:")) {
      config.subtitle = trimmed.replace("subtitle:", "").trim().replace(/^"|"$/g, "")
    } else if (trimmed.startsWith("height:")) {
      config.height = trimmed.replace("height:", "").trim()
    } else if (trimmed === "events:") {
      // Start of events section
    } else if (trimmed.startsWith("- year:")) {
      // Save previous event if exists
      if (currentEvent && currentEvent.year && currentEvent.headline) {
        config.events.push(currentEvent as TimelineEvent)
      }
      currentEvent = {
        year: parseInt(trimmed.replace("- year:", "").trim()),
      }
    } else if (currentEvent) {
      if (trimmed.startsWith("headline:")) {
        currentEvent.headline = trimmed.replace("headline:", "").trim().replace(/^"|"$/g, "")
      } else if (trimmed.startsWith("text:")) {
        currentEvent.text = trimmed.replace("text:", "").trim().replace(/^"|"$/g, "")
      } else if (trimmed.startsWith("group:")) {
        currentEvent.group = trimmed.replace("group:", "").trim().replace(/^"|"$/g, "")
      } else if (trimmed.startsWith("endYear:")) {
        currentEvent.endYear = parseInt(trimmed.replace("endYear:", "").trim())
      } else if (trimmed.startsWith("month:")) {
        currentEvent.month = parseInt(trimmed.replace("month:", "").trim())
      } else if (trimmed.startsWith("day:")) {
        currentEvent.day = parseInt(trimmed.replace("day:", "").trim())
      }
    }
  }

  // Save last event
  if (currentEvent && currentEvent.year && currentEvent.headline) {
    config.events.push(currentEvent as TimelineEvent)
  }

  return config
}
