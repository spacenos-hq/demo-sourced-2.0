from pathlib import Path

from playwright.sync_api import sync_playwright


SRC = Path(r"G:\HQ Downloads\sourced_ai_section.html")
OUT_DIR = Path(r"N:\Dibbs 2.0\Sales Pitch\assets\ai-screens")


def save_locator_shot(page, selector: str, out_name: str, padding: int = 16) -> None:
    locator = page.locator(selector).first
    locator.wait_for(state="visible", timeout=15000)
    box = locator.bounding_box()
    if not box:
        raise RuntimeError(f"Could not capture selector: {selector}")

    clip = {
        "x": max(0, box["x"] - padding),
        "y": max(0, box["y"] - padding),
        "width": box["width"] + (padding * 2),
        "height": box["height"] + (padding * 2),
    }
    page.screenshot(path=str(OUT_DIR / out_name), clip=clip)


def save_locator_element_shot(page, selector: str, out_name: str) -> None:
    locator = page.locator(selector).first
    locator.wait_for(state="visible", timeout=15000)
    locator.screenshot(path=str(OUT_DIR / out_name))


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    url = SRC.resolve().as_uri()

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1600, "height": 4200})
        page.goto(url, wait_until="networkidle")
        page.wait_for_timeout(1200)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(300)

        save_locator_shot(page, ".hero", "ai-hero-overview.png")
        save_locator_shot(page, ".section-block:nth-of-type(1)", "ai-screen-01-rfq-stack.png")
        # Use full element screenshots for these sections to avoid any clip-edge cutoffs.
        save_locator_element_shot(page, ".section-block:nth-of-type(2)", "ai-screen-02-outreach-discovery.png")
        save_locator_shot(page, ".section-block:nth-of-type(3)", "ai-screen-03-tracker-split.png")
        save_locator_element_shot(page, ".section-block:nth-of-type(4)", "ai-screen-04-negotiation-terminal.png")
        save_locator_shot(page, ".section-block:nth-of-type(5)", "ai-screen-05-confirmation-flywheel.png")

        browser.close()

    print(f"Saved screenshots to: {OUT_DIR}")


if __name__ == "__main__":
    main()
