import { createOrGetDailyGrid } from "../src/lib/grid/scheduler";

async function main() {
  try {
    console.log("🎮 Seeding today's grid...");
    const { grid, created } = await createOrGetDailyGrid();

    console.log(
      `📅 Date: ${grid.date.toISOString().split("T")[0]}\n#️⃣ Grid Number: ${grid.gridNumber}`
    );
    console.log(`\n✅ Grid ${created ? "created" : "already existed"} successfully!`);
    console.log(`Grid ID: ${grid.id}`);
    console.log("\n📊 Grid Layout:");
    console.log("Rows (clubs + award):");
    
    // Display row criteria
    const rowCriteria = [
      { row: 0, type: grid.cells[0].rowType, value: grid.cells[0].rowValue },
      { row: 1, type: grid.cells[3].rowType, value: grid.cells[3].rowValue },
      { row: 2, type: grid.cells[6].rowType, value: grid.cells[6].rowValue },
    ];
    
    rowCriteria.forEach((r) => {
      console.log(`  Row ${r.row}: ${r.value} (${r.type})`);
    });

    console.log("\nColumns (countries + award):");
    
    // Display column criteria
    const colCriteria = [
      { col: 0, type: grid.cells[0].colType, value: grid.cells[0].colValue },
      { col: 1, type: grid.cells[1].colType, value: grid.cells[1].colValue },
      { col: 2, type: grid.cells[2].colType, value: grid.cells[2].colValue },
    ];
    
    colCriteria.forEach((c) => {
      console.log(`  Col ${c.col}: ${c.value} (${c.type})`);
    });

    console.log("\n🎉 Done! You can now test the grid in your dashboard.");
  } catch (error) {
    console.error("❌ Error seeding grid:", error);
    process.exit(1);
  }
}

main();
