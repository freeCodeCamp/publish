import Bree from "bree";
import path from "path";

const bree = new Bree({
  root: path.join(__dirname, "jobs"),
  defaultExtension: process.env.NODE_ENV === "production" ? "js" : "ts",
  jobs: [
    {
      name: "check-and-publish",
      interval: "5m",
      timeout: 0,
    },
  ],
});

(async () => {
  await bree.start();
})();
