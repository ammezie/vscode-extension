import {
  HoverProvider,
  TextDocument,
  Position,
  ProviderResult,
  Hover
} from "vscode";
import { Config } from "../../../utilities";
import { getExactPathMatch } from "../../../utilities/pathMatching";
import { generateDocFromPath } from "../../../utilities/documentation";

class EdgeHoverProvider implements HoverProvider {
  provideHover(doc: TextDocument, pos: Position): ProviderResult<Hover> {
    const config = Config.autocomplete;
    const regex = new RegExp(config.viewsRegex);
    const range = doc.getWordRangeAtPosition(pos, regex);
    if (!range) return;

    const text = doc.getText(range);
    const matchedView = getExactPathMatch(
      text,
      doc,
      config.viewsDirectories,
      config.viewsExtensions
    );

    if (matchedView) {
      const markdown = generateDocFromPath(
        matchedView,
        Config.autocomplete.folderTip
      );
      return new Hover(markdown);
    }
  }
}

export default EdgeHoverProvider;
