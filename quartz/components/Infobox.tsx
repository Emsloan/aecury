import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/infobox.scss"
import { resolveRelative, simplifySlug } from "../util/path"
import { classNames } from "../util/lang"

interface InfoboxOptions {
  hideWhenEmpty: boolean
}

const defaultOptions: InfoboxOptions = {
  hideWhenEmpty: true,
}

// Fields to skip (system/internal fields)
const SKIP_FIELDS = new Set([
  "title",
  "slug",
  "draft",
  "wip",
  "tags",
  "description",
  "date",
  "created",
  "modified",
  "publish",
  "aliases",
])

// Field display names (prettier labels)
const FIELD_LABELS: Record<string, string> = {
  // Organization fields
  Type: "Type",
  Capital: "Capital",
  Leader: "Leader",
  Leadertitle: "Leader Title",
  Headofstate: "Head of State",
  Headofgovernment: "Head of Government",
  Founders: "Founder(s)",
  Geographiclocation: "Location",
  Statereligion: "State Religion",
  Rulingorganization: "Ruling Body",
  Parent: "Parent",
  Children: "Subdivisions",
  Organizationranks: "Ranks",
  Deities: "Deities",
  Ethnicities: "Ethnicities",
  Relatedspecies: "Species",
  Locations: "Locations",
  Maps: "Maps",
  Flag: "Flag",
  Plots: "Related Plots",
  Belligerents: "Belligerents",
  Organizationformations: "Military Units",
  Historicentries: "History",

  // Person fields
  Currentranks: "Title/Rank",
  Organizations: "Organizations",
  Families: "Family",
  Religions: "Religion",

  // Settlement fields
  Claimedcapitals: "Capital Of",
  Includedorganizations: "Organizations",
  Person: "Ruler",
  Rank: "Ruler Title",
  Organization: "Government",
  Additionalrulers: "Other Leaders",
  Ranks: "Ranks",

  // Location fields
  Articleparent: "Parent",
  Conflicts: "Conflicts",
  Items: "Notable Items",
  People: "Notable People",
  Relatedhistories: "History",

  // Rank fields
  Leaders: "Leads",
  Currentholders: "Current Holder",
  Firstholder: "First Holder",
  Relatedorganizations: "Organizations",
  Relatedlocations: "Locations",

  // MilitaryConflict fields
  Location: "Location",

  // Infobox short fields (from sections)
  Motto: "Motto",
  Demonym: "Demonym",
  Currency: "Currency",
  GovernmentSystem: "Government",
  PowerStructure: "Power Structure",
  EconomicSystem: "Economy",
  LegislativeBody: "Legislative",
  JudicialBody: "Judicial",
  ExecutiveBody: "Executive",
  AlternativeNames: "Also Known As",
  Population: "Population",
  Constructed: "Constructed",
  FoundingDate: "Founded",
  Pronunciation: "Pronunciation",
  Assets: "Assets",
  Demographics: "Demographics",
  Structure: "Structure",
  PointsOfInterest: "Points of Interest",
  Districts: "Districts",
  Appointment: "Appointment",
  AuthoritySource: "Authority",
  AlternativeTitle: "Alt. Titles",
  Result: "Result",
  BattlefieldType: "Battlefield",
}

// Parse a wikilink like "[[Name]]" or "[[Name|Display]]" and return { name, display }
function parseWikilink(link: string): { name: string; display: string } | null {
  const match = link.match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]$/)
  if (!match) return null
  return {
    name: match[1].trim(),
    display: match[2]?.trim() || match[1].trim(),
  }
}

// Convert a title to a likely slug (simplified)
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default ((opts?: Partial<InfoboxOptions>) => {
  const options: InfoboxOptions = { ...defaultOptions, ...opts }

  const Infobox: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
  }: QuartzComponentProps) => {
    const frontmatter = fileData.frontmatter
    if (!frontmatter) return null

    const entityType = frontmatter.type as string
    if (!entityType) return null

    // Get all displayable fields
    const fields: Array<{ key: string; label: string; value: unknown }> = []

    for (const [key, value] of Object.entries(frontmatter)) {
      if (SKIP_FIELDS.has(key.toLowerCase())) continue
      if (key === "type") continue // We show type separately in header
      if (value === null || value === undefined) continue
      if (typeof value === "boolean") continue
      if (Array.isArray(value) && value.length === 0) continue

      fields.push({
        key,
        label: FIELD_LABELS[key] || key.replace(/([A-Z])/g, " $1").trim(),
        value,
      })
    }

    if (options.hideWhenEmpty && fields.length === 0) {
      return null
    }

    // Helper to render a value (handles wikilinks and arrays)
    const renderValue = (value: unknown): preact.JSX.Element | preact.JSX.Element[] | string => {
      if (typeof value === "string") {
        // Check if it's a wikilink
        const parsed = parseWikilink(value)
        if (parsed) {
          // Try to find the file by title
          const targetSlug = titleToSlug(parsed.name)
          const targetFile = allFiles.find((f) => {
            const fSlug = simplifySlug(f.slug!)
            return (
              fSlug.includes(targetSlug) ||
              f.frontmatter?.title?.toLowerCase() === parsed.name.toLowerCase()
            )
          })

          if (targetFile) {
            return (
              <a href={resolveRelative(fileData.slug!, targetFile.slug!)} class="internal">
                {parsed.display}
              </a>
            )
          }
          // No matching file found, just display the text
          return <span class="broken-link">{parsed.display}</span>
        }
        // Not a wikilink, just return the string
        return value
      }

      if (Array.isArray(value)) {
        const items = value.map((item, idx) => {
          const rendered = renderValue(item)
          return (
            <span key={idx}>
              {rendered}
              {idx < value.length - 1 ? ", " : ""}
            </span>
          )
        })
        return <>{items}</>
      }

      return String(value)
    }

    return (
      <div class={classNames(displayClass, "infobox")}>
        <div class="infobox-header">
          <span class="infobox-type">{entityType}</span>
        </div>
        <table class="infobox-table">
          <tbody>
            {fields.map(({ key, label, value }) => (
              <tr key={key} class="infobox-row">
                <th class="infobox-label">{label}</th>
                <td class="infobox-value">{renderValue(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  Infobox.css = style

  return Infobox
}) satisfies QuartzComponentConstructor
