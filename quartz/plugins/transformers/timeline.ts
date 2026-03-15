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
          return (tree: Root) => {
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
                    const timelineId = `timeline-${Math.random().toString(36).substr(2, 9)}`

                    // Convert to TimelineJS JSON format
                    const timelineData = {
                      title: config.title ? {
                        text: {
                          headline: config.title,
                          text: config.subtitle || "",
                        },
                      } : undefined,
                      events: config.events.map((event) => ({
                        start_date: {
                          year: event.year,
                          month: event.month,
                          day: event.day,
                        },
                        end_date: event.endYear ? {
                          year: event.endYear,
                        } : undefined,
                        text: {
                          headline: event.headline,
                          text: event.text || "",
                        },
                        group: event.group,
                      })),
                    }

                    // Replace code block with timeline container
                    const timelineDiv: Element = {
                      type: "element",
                      tagName: "div",
                      properties: {
                        id: timelineId,
                        className: ["timeline-container"],
                        "data-timeline": JSON.stringify(timelineData),
                        style: `height: ${config.height || opts.defaultHeight}; width: 100%; margin: 1rem 0;`,
                      },
                      children: [],
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
        function initTimelines() {
          const containers = document.querySelectorAll(".timeline-container");
          containers.forEach((container) => {
            if (container.dataset.initialized === "true") return;
            if (typeof TL === "undefined") return;

            try {
              const data = JSON.parse(container.dataset.timeline);
              new TL.Timeline(container.id, data, {
                hash_bookmark: false,
                initial_zoom: 2,
                timenav_height_percentage: 25,
              });
              container.dataset.initialized = "true";
            } catch (e) {
              console.error("Timeline init error:", e);
            }
          });
        }
        document.addEventListener("nav", initTimelines);
        if (document.readyState === "complete") { initTimelines(); }
        else { window.addEventListener("load", initTimelines); }
      `

      return {
        css: [
          { content: "https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css" },
        ],
        js: [
          {
            src: "https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js",
            loadTime: "beforeDOMReady",
            contentType: "external",
          },
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: initScript,
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
