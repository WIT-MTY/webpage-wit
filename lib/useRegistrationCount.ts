'use client'

import { useEffect, useState } from 'react'

/*
  Live registration count for an event.

  Where the number comes from:
    Google Form → linked Google Sheet → a small Google Apps Script published
    as a web app that returns ONLY { "count": 128 } as JSON.

  The script must never expose the responses themselves: they contain
  students' names and emails. Count only.

  Apps Script (Extensions → Apps Script in the sheet, then Deploy → Web app,
  access "Anyone"):

    function doGet() {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
      const count = Math.max(0, sheet.getLastRow() - 1) // minus the header row
      return ContentService
        .createTextOutput(JSON.stringify({ count }))
        .setMimeType(ContentService.MimeType.JSON)
    }

  Returns null while loading, if there is no URL set, or if the fetch fails.
  Components show "—" in that case.
*/
export function useRegistrationCount(url: string | null, refreshMs = 60_000) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    if (!url) return
    let alive = true
    const load = async () => {
      try {
        const res = await fetch(url, { cache: 'no-store' })
        const data = await res.json()
        if (alive && typeof data?.count === 'number') setCount(data.count)
      } catch {
        // offline or the script is down: keep showing "—"
      }
    }
    load()
    const id = window.setInterval(load, refreshMs)
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [url, refreshMs])

  return count
}
