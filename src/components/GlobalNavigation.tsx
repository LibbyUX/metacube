import "./global-navigation.css";
import { useTheme } from "../data/themeContext";

const BASE = import.meta.env.BASE_URL;
const FULL_IMPLEMENTATION_URL = `${BASE}playground/index.html?dataset=cifar_organs&view=implementation`;

export type GlobalNavigationPage = "implementation" | "configuration" | "preview";

const destinations: Array<{ page: GlobalNavigationPage; label: string; href: string }> = [
  { page: "preview", label: "Preview component", href: `${BASE}cifar-cube/index.html` },
  { page: "implementation", label: "CIFAR metacube demo", href: FULL_IMPLEMENTATION_URL },
  { page: "configuration", label: "Build a metacube", href: `${BASE}playground/index.html` },
];

/**
 * Provides consistent navigation between the repository's three browser experiences.
 *
 * @param props - Component properties.
 * @param props.activePage - Destination representing the page currently being viewed.
 * @returns The shared global navigation header.
 */
export function GlobalNavigation({ activePage }: { activePage: GlobalNavigationPage }) {
  const { mode, setMode } = useTheme();

  return (
    <header className="global-navigation">
      <a className="global-navigation__brand" href={`${BASE}cifar-cube/index.html`}>Preview Component</a>
      <div className="global-navigation__utilities">
        <nav aria-label="Metacube views">
          <ul className="global-navigation__list">
            {destinations.map(({ page, label, href }) => (
              <li key={page}>
                <a
                  className="global-navigation__link"
                  href={href}
                  aria-current={page === activePage ? "page" : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <fieldset className="global-navigation__theme-controls">
          <legend className="global-navigation__sr-only">Theme</legend>
          <span className="global-navigation__theme-label" aria-hidden="true">Theme</span>
          <div className="global-navigation__theme-options">
            <button
              className="global-navigation__theme-button"
              type="button"
              aria-pressed={mode === "light"}
              onClick={() => setMode("light")}
            >
              Light
            </button>
            <button
              className="global-navigation__theme-button"
              type="button"
              aria-pressed={mode === "dark"}
              onClick={() => setMode("dark")}
            >
              Dark
            </button>
          </div>
        </fieldset>
      </div>
    </header>
  );
}
