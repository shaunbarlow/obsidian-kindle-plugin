import type { Root } from 'cheerio';

import type { Book, Highlight } from '../models';
import { loadRemoteDom } from './loadRemoteDom';

const mapTextToColor = (colorText: string): Highlight['color'] => {
  switch (colorText?.toLowerCase()) {
    case 'blue':
      return 'blue';
    case 'orange':
      return 'orange';
    case 'pink':
      return 'pink';
    case 'yellow':
      return 'yellow';
    default:
      return null;
  }
};

export const parseHighlights = ($: Root): Highlight[] => {
  const highlightsEl = $(
    '#kp-notebook-annotations .a-row.a-spacing-base'
  ).toArray();

  return highlightsEl.map(
    (highlightEl): Highlight => {
      const pageMatch = $('#annotationNoteHeader', highlightEl)
        .text()
        ?.match(/\d+$/);

      return {
        id: $(highlightEl).attr('id') as string,
        text: $('#highlight', highlightEl).text(),
        color: mapTextToColor(
          $('#annotationHighlightHeader', highlightEl).text().split(' ')[0]
        ),
        location: $('#kp-annotation-location', highlightEl).val(),
        page: pageMatch ? pageMatch[0] : null,
        note: $('#note', highlightEl).text(),
      };
    }
  );
};

const scrapeBookHighlights = async (book: Book): Promise<Highlight[]> => {
  const dom = await loadRemoteDom(
    `https://read.amazon.com/notebook?asin=${book.asin}&contentLimitState=&`
  );

  return parseHighlights(dom);
};

export default scrapeBookHighlights;