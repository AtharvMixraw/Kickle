import { createOrGetDailyGrid } from "../src/lib/grid/scheduler";

async function main() {
  try {
    const { grid, created } = await createOrGetDailyGrid();

    console.log(
      `${created ? "Created" : "Found"} grid #${grid.gridNumber} for ${grid.date.toISOString()}`
    );
  } catch (error) {
    console.error("Failed to create daily grid:", error);
    process.exit(1);
  }
}

main();
