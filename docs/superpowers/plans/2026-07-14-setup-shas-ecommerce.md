# Setup Shas E-commerce Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Copy and setup Vigrahakart project files into Shas E-commerce root, removing old Git history and Supabase settings to prepare for a fresh brand/database configuration.

**Architecture:** Move all files from the `vigrahakart` subdirectory to the root workspace. Remove `.git`, `.github` (which contains old repo workflows), and `supabase/` folders. Ensure `package.json` and basic project configurations are updated to reference the new project "shas-website".

**Tech Stack:** React 19, Vite 8, Bun package manager.

## Global Constraints

- Do not keep any old `.git` repository folder from `vigrahakart`.
- Remove `supabase/` directory completely as we will use a new Supabase account and schemas later.
- Update metadata naming to "shas-website" and title to "Shas Jewellery".

---

### Task 1: Copy Vigrahakart Files to Root and Clean Up

**Files:**
- Create/Modify: Root directory files copied from `vigrahakart` directory.

- [ ] **Step 1: Copy all files from `vigrahakart` subfolder to root directory, excluding `.git` and `supabase`**
  Run:
  ```bash
  rsync -av --exclude='.git' --exclude='supabase' vigrahakart/ ./
  ```
  Expected: All files are copied to the root folder.

- [ ] **Step 2: Remove the original `vigrahakart` subdirectory**
  Run:
  ```bash
  rm -rf vigrahakart
  ```
  Expected: The subdirectory `vigrahakart` is deleted.

- [ ] **Step 3: Verify the root directory structure**
  Run:
  ```bash
  ls -la
  ```
  Expected: Root contains `src`, `public`, `package.json`, `index.html`, etc. And does not contain `.git` or `supabase`.

---

### Task 2: Rename Project References to Shas

**Files:**
- Modify: `package.json`
- Modify: `index.html`

- [ ] **Step 1: Modify package.json to rename the project to "shas-website"**
  Edit: `package.json` line 34:
  ```json
  "name": "shas-website",
  ```

- [ ] **Step 2: Modify index.html to update the title to "Shas Jewellery"**
  Edit: `index.html`
  ```html
  <title>Shas Jewellery</title>
  ```

- [ ] **Step 3: Run package installation to verify dependencies**
  Run:
  ```bash
  bun install
  ```
  Expected: Successful package installation.

- [ ] **Step 4: Run development server to verify the project builds and runs**
  Run:
  ```bash
  bun run dev
  ```
  Expected: Vite dev server starts successfully.
