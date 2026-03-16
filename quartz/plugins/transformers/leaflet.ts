import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Element, Root } from "hast"

interface LeafletOptions {
  // Default map settings
  defaultZoom: number
  defaultCenter: [number, number]
  tileLayer: string
  tileAttribution: string
}

const defaultOptions: LeafletOptions = {
  defaultZoom: 5,
  defaultCenter: [0, 0],
  tileLayer: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  tileAttribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
}

export const Leaflet: QuartzTransformerPlugin<Partial<LeafletOptions>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "Leaflet",
    htmlPlugins() {
      return [
        () => {
          return (tree: Root) => {
            visit(tree, "element", (node: Element, index, parent) => {
              // Look for code blocks with language "leaflet"
              if (
                node.tagName === "pre" &&
                node.children?.[0] &&
                (node.children[0] as Element).tagName === "code"
              ) {
                const codeElement = node.children[0] as Element
                const className = (codeElement.properties?.className as string[]) || []

                if (className.some((c) => c.includes("language-leaflet"))) {
                  // Parse the leaflet config from code block content
                  const content = codeElement.children?.[0]
                  if (content && content.type === "text") {
                    const config = parseLeafletConfig(content.value)
                    const mapId = `leaflet-map-${Math.random().toString(36).substr(2, 9)}`

                    // Replace code block with map container
                    const mapDiv: Element = {
                      type: "element",
                      tagName: "div",
                      properties: {
                        id: mapId,
                        className: ["leaflet-map-container"],
                        "data-lat": config.lat?.toString() || opts.defaultCenter[0].toString(),
                        "data-lng": config.lng?.toString() || opts.defaultCenter[1].toString(),
                        "data-zoom": config.zoom?.toString() || opts.defaultZoom.toString(),
                        "data-markers": JSON.stringify(config.markers || []),
                        "data-image": config.image || "",
                        "data-bounds": JSON.stringify(config.bounds || []),
                        style: `height: ${config.height || "400px"}; width: 100%; border-radius: 8px; margin: 1rem 0;`,
                      },
                      children: [],
                    }

                    if (parent && typeof index === "number") {
                      parent.children[index] = mapDiv
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
        function initLeafletMaps() {
          const mapContainers = document.querySelectorAll(".leaflet-map-container");
          mapContainers.forEach((container) => {
            if (container.dataset.initialized === "true") return;
            if (typeof L === "undefined") return;

            const lat = parseFloat(container.dataset.lat || "0");
            const lng = parseFloat(container.dataset.lng || "0");
            const zoom = parseInt(container.dataset.zoom || "5");
            const imageUrl = container.dataset.image;
            const bounds = container.dataset.bounds ? JSON.parse(container.dataset.bounds) : null;
            const markers = container.dataset.markers ? JSON.parse(container.dataset.markers) : [];

            let map;
            if (imageUrl && bounds && bounds.length === 2) {
              map = L.map(container, { crs: L.CRS.Simple, minZoom: -3, maxZoom: 4 });
              L.imageOverlay(imageUrl, bounds).addTo(map);
              map.fitBounds(bounds, { padding: [20, 20] });
              // Ensure map renders correctly after container is sized
              setTimeout(function() { map.invalidateSize(); map.fitBounds(bounds); }, 100);
            } else {
              map = L.map(container).setView([lat, lng], zoom);
              L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
              }).addTo(map);
            }

            markers.forEach((marker) => {
              const m = L.marker([marker.lat, marker.lng]).addTo(map);
              if (marker.link) {
                m.bindPopup('<a href="' + marker.link + '">' + marker.label + '</a>');
              } else {
                m.bindPopup(marker.label);
              }
            });

            container.dataset.initialized = "true";
          });
        }
        document.addEventListener("nav", initLeafletMaps);
        if (document.readyState === "complete") { initLeafletMaps(); }
      `

      return {
        css: [
          { content: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" },
        ],
        js: [
          {
            src: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
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

interface LeafletConfig {
  lat?: number
  lng?: number
  zoom?: number
  height?: string
  image?: string
  bounds?: [[number, number], [number, number]]
  markers?: Array<{
    lat: number
    lng: number
    label: string
    link?: string
  }>
}

function parseLeafletConfig(content: string): LeafletConfig {
  const config: LeafletConfig = {}
  const lines = content.trim().split("\n")

  let currentMarkers: LeafletConfig["markers"] = []
  let inMarkers = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith("lat:")) {
      config.lat = parseFloat(trimmed.replace("lat:", "").trim())
    } else if (trimmed.startsWith("lng:") || trimmed.startsWith("long:")) {
      config.lng = parseFloat(trimmed.replace(/lng:|long:/, "").trim())
    } else if (trimmed.startsWith("zoom:")) {
      config.zoom = parseInt(trimmed.replace("zoom:", "").trim())
    } else if (trimmed.startsWith("height:")) {
      config.height = trimmed.replace("height:", "").trim()
    } else if (trimmed.startsWith("image:")) {
      config.image = trimmed.replace("image:", "").trim()
    } else if (trimmed.startsWith("bounds:")) {
      try {
        config.bounds = JSON.parse(trimmed.replace("bounds:", "").trim())
      } catch {}
    } else if (trimmed === "markers:") {
      inMarkers = true
    } else if (inMarkers && trimmed.startsWith("-")) {
      // Parse marker: - [lat, lng, "Label", "link"]
      const markerMatch = trimmed.match(/^-\s*\[([-\d.]+),\s*([-\d.]+),\s*"([^"]+)"(?:,\s*"([^"]+)")?\]/)
      if (markerMatch) {
        currentMarkers.push({
          lat: parseFloat(markerMatch[1]),
          lng: parseFloat(markerMatch[2]),
          label: markerMatch[3],
          link: markerMatch[4],
        })
      }
    }
  }

  if (currentMarkers.length > 0) {
    config.markers = currentMarkers
  }

  return config
}
