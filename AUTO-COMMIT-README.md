# Auto-Commit Functionality

This directory contains scripts to automatically commit your file changes individually with formatted commit messages.

## Features

- Automatically detects modified files in your git repository
- Commits each file individually with a commit message in the format "Modified{filename}"
- File watcher that monitors for changes and triggers commits automatically

## Scripts

1. `auto-commit.sh` - Core script that commits modified files individually
2. `watch-and-commit.sh` - File watcher that runs auto-commit.sh when changes are detected

## Requirements

- Git (must be installed and repository initialized)
- fswatch (for the file watcher functionality)
  - On macOS: `brew install fswatch`

## Usage

### Manual Commit

To manually run the auto-commit script once:

```bash
./auto-commit.sh
```

### Automatic Commit (File Watcher)

To start the file watcher that will automatically commit changes:

```bash
./watch-and-commit.sh
```

The watcher will run in the foreground. Press Ctrl+C to stop it.

To run it in the background:

```bash
nohup ./watch-and-commit.sh > auto-commit.log 2>&1 &
```

## Customization

You can customize the scripts by editing them:

- In `auto-commit.sh`, you can modify the commit message format
- In `watch-and-commit.sh`, you can adjust the `IGNORE_PATTERN` to exclude additional directories or files from being watched 