# FireEnjin ⚠️DEPRECATED⚠️

This is a set of build process tasks aimed to make working with full-stack Firebase projects easier by the good people at Madness Labs.

## This project has a new home

https://github.com/fireenjin/cli

---


## Below is for documentation purposes only


# Getting Started

Install fireenjin into your project and then you can run it with scripts in your package.json.

```bash
# Install fireenjin as dev dependency
npm install --save-dev @madnesslabs/fireenjin

# Use commands like this in your package.json under scripts
fireenjin generate model
```

# Commands

**copy**

This command copies a file from one place to another.

**env**

This command copies files from the env folder into the root.

**generate**

This command generated a file or a list of files based off templates.

**migrate**

This command runs all migrations and stores results in Firestore.

**new**

This command will walk you through setting up a new project.

**presets**

This command will compile all of your presets into a javascript file.

**seed**

This command allows you to deploy seeds from your project to Firestore.

**seed:clone**

This command allows you to clone seeds from Firestore to your project.

**triggers**

This command builds an index for Firebase Functions.
