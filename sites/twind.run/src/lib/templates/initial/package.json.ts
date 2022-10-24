import { version as initialVersion } from "twind/package.json"

export default JSON.stringify(
  {
    "// define which versions should be used":
      "The fields dependencies, devDependencies, and peerDependencies are supported as well",
    versions: { twind: initialVersion, "@twind/*": initialVersion },
  },
  null,
  2,
)
