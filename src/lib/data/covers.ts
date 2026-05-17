// Cover lookup with fallback chain.
//
// 1. Open Library Search → cover_i → /covers.openlibrary.org/b/id/<id>-L.jpg
//    Free, no auth, but coverage is patchy (new, self-pub, and many popular
//    titles simply have no cover in their collection).
// 2. iTunes Search API → artworkUrl100 enlarged to 600px
//    Free, no auth, surprisingly strong cover coverage for English-language
//    books, including modern non-fiction that Open Library tends to miss.
// 3. Give up and return null — caller renders the procedural BookCover.

async function tryOpenLibrary(title: string, author: string, signal?: AbortSignal): Promise<string | null> {
  try {
    const t = encodeURIComponent(title);
    const a = encodeURIComponent(author);
    const res = await fetch(`https://openlibrary.org/search.json?title=${t}&author=${a}&limit=3`, { signal });
    if (!res.ok) return null;
    const json = (await res.json()) as { docs?: { cover_i?: number }[] };
    const coverId = json.docs?.find((d) => d.cover_i)?.cover_i;
    return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;
  } catch {
    return null;
  }
}

async function tryItunes(title: string, author: string, signal?: AbortSignal): Promise<string | null> {
  try {
    const term = encodeURIComponent(`${title} ${author}`.trim());
    const res = await fetch(`https://itunes.apple.com/search?term=${term}&media=ebook&limit=1`, { signal });
    if (!res.ok) return null;
    const json = (await res.json()) as { results?: { artworkUrl100?: string }[] };
    const art = json.results?.[0]?.artworkUrl100;
    if (!art) return null;
    // iTunes returns 100×100. Swap the sizing segment for a sharper 600×600.
    return art.replace(/\/[^/]*?100x100bb\.\w+$/, '/600x600bb.jpg');
  } catch {
    return null;
  }
}

/**
 * Resolve a book cover image URL for the given title and author. Tries Open
 * Library first, then iTunes. Returns null if nothing is found. Aborts when
 * the supplied signal is aborted.
 */
export async function findCover(title: string, author: string, signal?: AbortSignal): Promise<string | null> {
  if (!title) return null;
  const ol = await tryOpenLibrary(title, author, signal);
  if (ol) return ol;
  const itunes = await tryItunes(title, author, signal);
  if (itunes) return itunes;
  return null;
}

/**
 * Given an Open Library `cover_i`, returns the Open Library URL. Used when a
 * search result already carries a known cover id so we can skip the lookup.
 */
export function openLibraryCoverUrl(coverId: number): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
}
