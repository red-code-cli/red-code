import { Hono } from "hono"

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Session sharing has been discontinued | opencode</title>
    <style>
      :root {
        --text: hsl(224, 10%, 10%);
        --text-secondary: hsl(224, 7%, 46%);
        --border: hsl(224, 6%, 77%);
        --background: #ffffff;
        --logo-a: #211e1e;
        --logo-b: #656363;
        --logo-c: #cfcecd;
        --padding: 3rem;
        --vertical-padding: 1.5rem;
        --heading: 1.375rem;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --text: hsl(0, 0%, 100%);
          --text-secondary: hsl(224, 6%, 66%);
          --border: hsl(224, 6%, 36%);
          --background: #0c0c0e;
          --logo-a: #f1ecec;
          --logo-b: #b7b1b1;
          --logo-c: #4b4646;
        }
      }
      @media (max-width: 30rem) {
        :root {
          --padding: 1rem;
          --vertical-padding: 0.75rem;
          --heading: 1rem;
        }
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: calc(var(--padding) + 1rem);
        background: var(--background);
        color: var(--text);
        font-family: "Berkeley Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          "Liberation Mono", "Courier New", monospace;
        -webkit-font-smoothing: antialiased;
      }
      main {
        max-width: 40rem;
        width: 100%;
        border: 1px solid var(--border);
      }
      header {
        padding: var(--padding);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--vertical-padding);
        text-align: center;
      }
      svg {
        width: clamp(200px, 85vw, 400px);
        height: auto;
      }
      .a {
        fill: var(--logo-a);
      }
      .b {
        fill: var(--logo-b);
      }
      .c {
        fill: var(--logo-c);
      }
      h1 {
        margin: 0;
        font-size: var(--heading);
        font-weight: 500;
        line-height: 1.25;
        text-transform: uppercase;
      }
      p {
        margin: 0;
        max-width: 28rem;
        line-height: 1.6;
        color: var(--text-secondary);
      }
      nav {
        display: flex;
        border-top: 1px solid var(--border);
      }
      nav a {
        flex: 1;
        padding: var(--vertical-padding) 1rem;
        text-align: center;
        text-transform: uppercase;
        line-height: 1.4;
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 0.1875rem;
        text-decoration-thickness: 1px;
      }
      nav a + a {
        border-left: 1px solid var(--border);
      }
      @media (max-width: 40rem) {
        nav {
          flex-direction: column;
        }
        nav a + a {
          border-left: none;
          border-top: 1px solid var(--border);
        }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <a href="https://opencode.ai" aria-label="RedCode">
          <svg viewBox="0 0 234 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="c" d="M6 24H12V30H6ZM18 24H24V30H18ZM6 30H18V36H6Z" />
          <path class="b" d="M0 6H24V24H18V30H12V24H6V36H0V6ZM6 12V18H18V12H6ZM18 30H24V36H18V30Z" />
          <path class="c" d="M59 24V30H41V24H59Z" />
          <path class="b" d="M59 24H41V30H59V36H35V6H59V24ZM41 18H53V12H41V18Z" />
          <path class="c" d="M88 30H76V18H88V30Z" />
          <path class="b" d="M88 12H76V30H88V12ZM94 36H70V6H88V0H94V36Z" />
          <path class="c" d="M129 30H111V18H129V30Z" />
          <path class="a" d="M129 12H111V30H129V36H105V6H129V12Z" />
          <path class="c" d="M158 30H146V18H158V30Z" />
          <path class="a" d="M158 12H146V30H158V12ZM164 36H140V6H164V36Z" />
          <path class="c" d="M193 30H181V18H193V30Z" />
          <path class="a" d="M193 12H181V30H193V12ZM199 36H175V6H193V0H199V36Z" />
          <path class="c" d="M234 24V30H216V24H234Z" />
          <path class="a" d="M234 24H216V30H234V36H210V6H234V24ZM216 18H228V12H216V18Z" />
          </svg>
        </a>
        <h1>Session sharing has been discontinued</h1>
        <p>opencode no longer hosts shared sessions. This link and its content are no longer available.</p>
      </header>
      <nav>
        <a href="https://opencode.ai">Home</a>
        <a href="https://opencode.ai/docs">Docs</a>
        <a href="https://github.com/Vempire-X/RedCode">GitHub</a>
        <a href="https://opencode.ai/discord">Discord</a>
      </nav>
    </main>
  </body>
</html>`

// opncd.ai is the retired session-sharing host. V1 clients still create, sync, and remove shares on this host, and the V1 GitHub Action fails its run when share
// creation fails. Accept those requests without storing anything so existing clients keep working.
export default new Hono()
  .post("/api/share", async (c) => {
    const body = await c.req.json<{ sessionID: string }>()
    const id = body.sessionID.slice(-8)
    return c.json({ id, secret: "discontinued", url: new URL(`/share/${id}`, c.req.url).toString() })
  })
  .post("/api/share/:shareID/sync", (c) => c.json({}))
  .delete("/api/share/:shareID", (c) => c.json({}))
  .all("*", (c) => c.html(page, 410))
