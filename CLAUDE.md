# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **design-only repository** for Deep Brain Markets. It contains a single Pencil design file (`deepbrain.pen`) managed via the `pencil` MCP server.

## Working with Design Files

- **Read/edit `.pen` files exclusively via the `pencil` MCP tools** — never use `Read`, `Grep`, or text editors on them, as their contents are encrypted.
- Key tools: `get_editor_state`, `batch_get`, `batch_design`, `get_screenshot`, `snapshot_layout`.

## Design Constraints

- **cornerRadius**: always `8` for buttons, badges, and chips. Never use `9999` (pill/oval shape).
- **Mobile versions**: every design must have a mobile version at 375px width, created alongside the desktop version.

## Git Workflow

- Only `deepbrain.pen` and `CLAUDE.md` are tracked. The `ui/` folder and `.DS_Store` are gitignored.
- Do not add co-author lines to commit messages.
- Remote: `https://github.com/GCastilloDev/deep-brain-markets.git`
