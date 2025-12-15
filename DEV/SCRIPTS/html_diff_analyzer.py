"""
HTML File Comparison Tool - Enhanced with Targeted Diff View
Compares original HTML with LLM-modified version to verify compliance.
Focuses on: HTML IDs, structure, class changes, and added/removed elements.
"""

import difflib
import re
from pathlib import Path
from bs4 import BeautifulSoup
from typing import Dict, List, Tuple, Set


class HTMLDiffAnalyzer:
    """Analyzes differences between original and modified HTML files."""

    # Critical IDs that MUST be preserved (from Tenant Guide Section 1.3)
    REQUIRED_IDS = {
        "app-root",
        "app-header",
        "panel-visualization",
        "panel-steps",
        "panel-steps-list",
        "panel-step-description",
        "step-current",
    }

    def __init__(self, original_path: str, modified_path: str):
        self.original_path = Path(original_path)
        self.modified_path = Path(modified_path)
        self.original_html = self._load_html(original_path)
        self.modified_html = self._load_html(modified_path)
        self.original_soup = BeautifulSoup(self.original_html, "html.parser")
        self.modified_soup = BeautifulSoup(self.modified_html, "html.parser")

    def _load_html(self, path: str) -> str:
        """Load HTML file content."""
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    def extract_ids(self, soup: BeautifulSoup) -> Set[str]:
        """Extract all HTML element IDs from parsed HTML."""
        return {elem.get("id") for elem in soup.find_all(id=True)}

    def check_required_ids(self) -> Dict[str, any]:
        """Verify all required IDs are present."""
        orig_ids = self.extract_ids(self.original_soup)
        mod_ids = self.extract_ids(self.modified_soup)

        missing = self.REQUIRED_IDS - mod_ids
        extra = mod_ids - orig_ids
        removed = orig_ids - mod_ids

        return {
            "original_ids": orig_ids,
            "modified_ids": mod_ids,
            "missing_required": missing,
            "new_ids": extra,
            "removed_ids": removed,
            "all_required_present": len(missing) == 0,
        }

    def extract_element_by_id(self, soup: BeautifulSoup, elem_id: str) -> str:
        """Get element HTML by ID."""
        elem = soup.find(id=elem_id)
        return str(elem) if elem else None

    def get_element_diff(self, elem_id: str) -> List[str]:
        """Get side-by-side diff for a specific element by ID."""
        orig_elem = self.extract_element_by_id(self.original_soup, elem_id)
        mod_elem = self.extract_element_by_id(self.modified_soup, elem_id)

        if not orig_elem or not mod_elem:
            return [f"Element #{elem_id} not found in one or both files"]

        # Pretty print HTML for better readability
        orig_lines = self._prettify_html(orig_elem).splitlines(keepends=True)
        mod_lines = self._prettify_html(mod_elem).splitlines(keepends=True)

        diff = list(
            difflib.unified_diff(
                orig_lines,
                mod_lines,
                fromfile=f"ORIGINAL #{elem_id}",
                tofile=f"MODIFIED #{elem_id}",
                lineterm="",
            )
        )

        return diff

    def _prettify_html(self, html_str: str) -> str:
        """Format HTML for better diff readability."""
        soup = BeautifulSoup(html_str, "html.parser")
        return soup.prettify()

    def get_section_diff(self, search_text: str, context_lines: int = 20) -> List[str]:
        """Get diff around a specific text/comment in the HTML."""
        orig_lines = self.original_html.splitlines(keepends=True)
        mod_lines = self.modified_html.splitlines(keepends=True)

        # Find line numbers containing search text
        orig_matches = [
            i
            for i, line in enumerate(orig_lines)
            if search_text.lower() in line.lower()
        ]
        mod_matches = [
            i for i, line in enumerate(mod_lines) if search_text.lower() in line.lower()
        ]

        if not orig_matches and not mod_matches:
            return [f"Text '{search_text}' not found in either file"]

        # Get context around first match
        start_orig = max(0, orig_matches[0] - context_lines) if orig_matches else 0
        end_orig = (
            min(len(orig_lines), orig_matches[0] + context_lines)
            if orig_matches
            else len(orig_lines)
        )

        start_mod = max(0, mod_matches[0] - context_lines) if mod_matches else 0
        end_mod = (
            min(len(mod_lines), mod_matches[0] + context_lines)
            if mod_matches
            else len(mod_lines)
        )

        orig_section = orig_lines[start_orig:end_orig]
        mod_section = mod_lines[start_mod:end_mod]

        diff = list(
            difflib.unified_diff(
                orig_section,
                mod_section,
                fromfile=f'ORIGINAL (around "{search_text}")',
                tofile=f'MODIFIED (around "{search_text}")',
                lineterm="",
            )
        )

        return diff

    def compare_critical_elements(self) -> Dict[str, Dict]:
        """Compare critical elements between files."""
        results = {}

        for elem_id in self.REQUIRED_IDS:
            orig_elem = self.extract_element_by_id(self.original_soup, elem_id)
            mod_elem = self.extract_element_by_id(self.modified_soup, elem_id)

            if orig_elem and mod_elem:
                changed = orig_elem != mod_elem
                results[elem_id] = {
                    "exists_in_both": True,
                    "changed": changed,
                    "original_tag": self.original_soup.find(id=elem_id).name,
                    "modified_tag": self.modified_soup.find(id=elem_id).name,
                    "original_classes": self.original_soup.find(id=elem_id).get(
                        "class", []
                    ),
                    "modified_classes": self.modified_soup.find(id=elem_id).get(
                        "class", []
                    ),
                }
            elif orig_elem and not mod_elem:
                results[elem_id] = {"exists_in_both": False, "status": "REMOVED"}
            elif not orig_elem and mod_elem:
                results[elem_id] = {"exists_in_both": False, "status": "ADDED"}
            else:
                results[elem_id] = {
                    "exists_in_both": False,
                    "status": "MISSING_FROM_BOTH",
                }

        return results

    def get_line_diff(self) -> List[str]:
        """Generate unified diff between files."""
        orig_lines = self.original_html.splitlines(keepends=True)
        mod_lines = self.modified_html.splitlines(keepends=True)

        diff = difflib.unified_diff(
            orig_lines,
            mod_lines,
            fromfile=str(self.original_path),
            tofile=str(self.modified_path),
            lineterm="",
        )

        return list(diff)

    def count_changes(self, diff_lines: List[str]) -> Dict[str, int]:
        """Count additions and deletions from diff."""
        additions = sum(
            1
            for line in diff_lines
            if line.startswith("+") and not line.startswith("+++")
        )
        deletions = sum(
            1
            for line in diff_lines
            if line.startswith("-") and not line.startswith("---")
        )

        return {
            "additions": additions,
            "deletions": deletions,
            "total_changes": additions + deletions,
        }

    def find_new_elements(self) -> List[Dict]:
        """Find HTML elements that were added."""
        orig_tags = [str(tag) for tag in self.original_soup.find_all()]
        mod_tags = [str(tag) for tag in self.modified_soup.find_all()]

        # Find tags in modified but not in original (simple approach)
        new_elements = []
        for tag in self.modified_soup.find_all():
            tag_str = str(tag)
            # Look for elements with new IDs
            if tag.get("id") and tag.get("id") not in self.extract_ids(
                self.original_soup
            ):
                new_elements.append(
                    {
                        "tag": tag.name,
                        "id": tag.get("id"),
                        "classes": tag.get("class", []),
                        "html": (
                            tag_str[:200] + "..." if len(tag_str) > 200 else tag_str
                        ),
                    }
                )

        return new_elements

    def show_targeted_diff(self, elem_id: str = None, search_text: str = None):
        """Show targeted diff for specific element or text section."""
        print("\n" + "=" * 80)
        print("TARGETED DIFF VIEW")
        print("=" * 80 + "\n")

        if elem_id:
            print(f"📍 Showing diff for element: #{elem_id}\n")
            diff = self.get_element_diff(elem_id)
            for line in diff:
                self._print_colored_diff_line(line)

        if search_text:
            print(f"\n📍 Showing diff around text: '{search_text}'\n")
            diff = self.get_section_diff(search_text, context_lines=15)
            for line in diff:
                self._print_colored_diff_line(line)

    def _print_colored_diff_line(self, line: str):
        """Print diff line with color coding."""
        if line.startswith("+++") or line.startswith("---"):
            print(f"\033[1m{line}\033[0m")  # Bold
        elif line.startswith("+"):
            print(f"\033[92m{line}\033[0m")  # Green
        elif line.startswith("-"):
            print(f"\033[91m{line}\033[0m")  # Red
        elif line.startswith("@@"):
            print(f"\033[96m{line}\033[0m")  # Cyan
        else:
            print(line)

    def generate_report(self) -> str:
        """Generate comprehensive comparison report."""
        report_lines = [
            "=" * 80,
            "HTML COMPARISON REPORT",
            "=" * 80,
            "",
            f"Original: {self.original_path}",
            f"Modified: {self.modified_path}",
            "",
        ]

        # ID Check
        id_check = self.check_required_ids()
        report_lines.extend(
            ["=" * 80, "1. REQUIRED HTML IDs (Section 1.3 Compliance)", "=" * 80, ""]
        )

        if id_check["all_required_present"]:
            report_lines.append("✅ ALL REQUIRED IDs PRESENT")
        else:
            report_lines.append("❌ MISSING REQUIRED IDs:")
            for missing_id in id_check["missing_required"]:
                report_lines.append(f"   - {missing_id}")

        report_lines.append("")

        if id_check["removed_ids"]:
            report_lines.append("⚠️  REMOVED IDs:")
            for removed_id in id_check["removed_ids"]:
                report_lines.append(f"   - {removed_id}")
            report_lines.append("")

        if id_check["new_ids"]:
            report_lines.append("➕ NEW IDs ADDED:")
            for new_id in id_check["new_ids"]:
                report_lines.append(f"   - {new_id}")
            report_lines.append("")

        # Critical Elements
        critical = self.compare_critical_elements()
        report_lines.extend(["=" * 80, "2. CRITICAL ELEMENTS ANALYSIS", "=" * 80, ""])

        for elem_id, info in critical.items():
            if info.get("exists_in_both"):
                status = "🔄 MODIFIED" if info["changed"] else "✅ UNCHANGED"
                report_lines.append(f"{status} - #{elem_id}")
                if info["changed"]:
                    orig_classes = " ".join(info["original_classes"])
                    mod_classes = " ".join(info["modified_classes"])
                    if orig_classes != mod_classes:
                        report_lines.append(
                            f"   Classes: '{orig_classes}' → '{mod_classes}'"
                        )
            else:
                report_lines.append(f"❌ {info['status']} - #{elem_id}")
            report_lines.append("")

        # New Elements
        new_elems = self.find_new_elements()
        if new_elems:
            report_lines.extend(["=" * 80, "3. NEW ELEMENTS DETECTED", "=" * 80, ""])
            for elem in new_elems:
                report_lines.append(f"Tag: <{elem['tag']}> | ID: {elem['id']}")
                if elem["classes"]:
                    report_lines.append(f"   Classes: {' '.join(elem['classes'])}")
                report_lines.append("")

        # Line Diff Summary
        diff = self.get_line_diff()
        changes = self.count_changes(diff)

        report_lines.extend(
            [
                "=" * 80,
                "4. CHANGE STATISTICS",
                "=" * 80,
                "",
                f"Lines Added:   {changes['additions']}",
                f"Lines Removed: {changes['deletions']}",
                f"Total Changes: {changes['total_changes']}",
                "",
            ]
        )

        # Detailed Diff (first 50 lines)
        if diff:
            report_lines.extend(
                ["=" * 80, "5. DETAILED DIFF (First 50 lines)", "=" * 80, ""]
            )
            report_lines.extend(diff[:50])
            if len(diff) > 50:
                report_lines.append(f"\n... ({len(diff) - 50} more diff lines omitted)")

        return "\n".join(report_lines)


def main():
    """Main execution function."""
    import sys

    if len(sys.argv) < 3:
        print("Usage:")
        print(
            "  Full report:    python html_diff_analyzer.py <original.html> <modified.html>"
        )
        print(
            "  Targeted diff:  python html_diff_analyzer.py <original.html> <modified.html> --target <element_id>"
        )
        print(
            "  Search diff:    python html_diff_analyzer.py <original.html> <modified.html> --search 'text'"
        )
        print("\nExamples:")
        print(
            "  python html_diff_analyzer.py orig.html mod.html --target panel-visualization"
        )
        print(
            "  python html_diff_analyzer.py orig.html mod.html --search 'Target Display'"
        )
        sys.exit(1)

    original_file = sys.argv[1]
    modified_file = sys.argv[2]

    try:
        analyzer = HTMLDiffAnalyzer(original_file, modified_file)

        # Check for targeted diff flags
        if len(sys.argv) > 3:
            if sys.argv[3] == "--target" and len(sys.argv) > 4:
                analyzer.show_targeted_diff(elem_id=sys.argv[4])
                return
            elif sys.argv[3] == "--search" and len(sys.argv) > 4:
                analyzer.show_targeted_diff(search_text=sys.argv[4])
                return

        # Generate full report
        report = analyzer.generate_report()

        # Print to console
        print(report)

        # Save to file
        output_file = "html_comparison_report.txt"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(report)

        print(f"\n\n✅ Report saved to: {output_file}")
        print("\n💡 TIP: Use targeted diff to inspect specific changes:")
        print(
            f"   python html_diff_analyzer.py {original_file} {modified_file} --target panel-visualization"
        )
        print(
            f"   python html_diff_analyzer.py {original_file} {modified_file} --search 'Target Display'"
        )

    except FileNotFoundError as e:
        print(f"❌ Error: File not found - {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
