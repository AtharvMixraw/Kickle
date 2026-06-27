interface GridPreviewProps {
  compact?: boolean;
}

export default function GridPreview({ compact = false }: GridPreviewProps) {
  const colHeaders = ["Real Madrid", "Man City", "🏆 UCL"];
  const rowHeaders = ["Brazil 🇧🇷", "France 🇫🇷", "Ballon d'Or"];
  const cells = [
    ["", "Ederson", "Marcelo"],
    ["Benzema", "?", "Henry"],
    ["Modric", "Rodri", "Kaka"],
  ];

  return (
    <div className={`w-full ${compact ? "max-w-sm" : "max-w-md"} aspect-square bg-background border-4 border-white p-4`}>
      <div className="grid grid-cols-4 gap-2 h-full">
        <div className="col-start-2 flex items-center justify-center bg-surface-container-highest text-[8px] font-bold uppercase text-on-background/60 p-1 text-center">
          {colHeaders[0]}
        </div>
        <div className="flex items-center justify-center bg-surface-container-highest text-[8px] font-bold uppercase text-on-background/60 p-1 text-center">
          {colHeaders[1]}
        </div>
        <div className="flex items-center justify-center bg-surface-container-highest text-[8px] font-bold uppercase text-on-background/60 p-1 text-center">
          {colHeaders[2]}
        </div>

        {rowHeaders.map((rowHeader, rowIndex) => (
          <div key={rowHeader} className="contents">
            <div
              className="flex items-center justify-center bg-surface-container-highest text-[8px] font-bold uppercase text-on-background/60 p-1 text-center"
            >
              {rowHeader}
            </div>

            {cells[rowIndex].map((cellValue, colIndex) => {
              const isQuestion = cellValue === "?";
              const isActive = (rowIndex === 0 && colIndex === 2) || (rowIndex === 1 && colIndex === 0) || (rowIndex === 2 && colIndex === 2);

              if (cellValue === "") {
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="bg-surface-container border-2 border-surface-container-highest flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-primary/20" />
                  </div>
                );
              }

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`flex items-center justify-center text-[10px] font-bold ${
                    isQuestion
                      ? "bg-white text-black font-black text-xl"
                      : isActive
                        ? "bg-primary text-black"
                        : "bg-surface-container border-2 border-surface-container-highest"
                  }`}
                >
                  {cellValue.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}