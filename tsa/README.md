# Think. Steer. Amplify.: the book's prompts, for AI agents

One page per day of the book (`p1.md` to `p30.md`). A reader sends their agent the short address printed in the book, such as `rodnavarro.com/tsa/p30`, and rodnavarro.com serves the matching file from this folder (branch `main`).

- These files are the live source. Fix a prompt here and every reader's agent gets the new version; the printed book can't change.
- Each page tells the agent who the reader is, to ask for the `[bracketed]` details first, and to follow the reader's rules before it sends, posts, pays or deletes anything.
- The first version was made from the book with `tools/export_prompts.py` in rodnavarro-org/2026-book (11/27).
