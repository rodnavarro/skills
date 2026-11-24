# Images

## First choice: real photos

Photos of the owner's real people, place and work build more trust than anything generated. Ask for them
in the brief. A phone photo in good daylight, cropped well, beats a stock photo.

Prepare every photo for the web: crop for the layout (a 4:5 or 3:4 portrait for a phone hero), export WebP
or AVIF at 2–3 widths (for example 480, 960 and 1440 px) for `srcset`, keep each under about 150 KB, and
write a real `alt` text ("Maria fitting a water heater in a Lakeland kitchen", not "image1").

## Making images: use what is at hand

Use the first option the owner (or you, the agent) already has. Ask before spending money.

1. **GPT image in ChatGPT or Codex.** If the owner has ChatGPT, GPT image makes and edits photos well.
   - In ChatGPT: give the prompt (and the reference photo for an edit), download the result.
   - In the **Codex CLI** signed in with their ChatGPT plan, an agent can ask Codex to make the image and
     save it in the project. A simple way to run it next to Claude Code: open a second tab in
     [herdr](https://herdr.dev) (the [rodnavarro/skills](https://github.com/rodnavarro/skills) installer sets
     herdr up), start `codex` there, and send it the prompt and the output path.
   - With an `OPENAI_API_KEY`, call the OpenAI Images API directly.
2. **fal** (fal.ai) with the owner's key (`FAL_KEY`): many image models, including photo edits that keep a
   face (Nano Banana edit, GPT image edit, Seedream edit). Pay per image, usually a few cents.
3. **kie.ai** with the owner's key (`KIE_AI_API_KEY`): used by cinematic mode for stills and short clips
   (`cinematic/scripts/kie.mjs`; costs in `.env.example`).
4. **Claude** does not make images itself. It writes the prompts, checks the results and prepares the files.

Keys go in the project's `.env` (never committed). See `.env.example`.

## A real person in a generated image

- Only with that person's OK, and only from their own photo.
- Give the model the photo and say what must not change: "same face, glasses, beard, skin tone and
  hairline; unchanged identity". Change pose, setting and light, not the person.
- Make three or four options and **look at each one next to the original**. Drop any where the face drifts.
- The owner picks. Keep the original and the prompts with the project.

## Prompts that work for a premium hero

- Say the pose ("seated on a simple stool, leaning slightly forward, hands loosely together"), the light
  ("warm key light from the right, soft shadows"), the backdrop in the brand colour, and the framing
  ("landscape, person in the right third, empty backdrop on the left for the headline").
- Ask for "no text, no logos". Add words on the page, not in the image.
- Ask for 2K or larger, then make the web sizes yourself.
