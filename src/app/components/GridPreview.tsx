interface GridPreviewProps {
  compact?: boolean;
}

export default function GridPreview({ compact = false }: GridPreviewProps) {
  const gridData = [
    { row: 'BRAZIL 🇧🇷', col: 'REAL MADRID', name: '' },
    { row: 'BRAZIL 🇧🇷', col: 'MAN CITY', name: 'Ederson' },
    { row: 'BRAZIL 🇧🇷', col: '🏆 UCL', name: 'Marcelo' },

    { row: 'FRANCE 🇫🇷', col: 'REAL MADRID', name: 'Benzema' },
    { row: 'FRANCE 🇫🇷', col: 'MAN CITY', name: '?' },
    { row: 'FRANCE 🇫🇷', col: '🏆 UCL', name: 'Henry' },

    { row: "BALLON D'OR", col: 'REAL MADRID', name: 'Modric' },
    { row: "BALLON D'OR", col: 'MAN CITY', name: 'Rodri' },
    { row: "BALLON D'OR", col: '🏆 UCL', name: 'Kaka' },
  ];

  const colHeaders = ['REAL MADRID', 'MAN CITY', '🏆 UCL'];
  const rowHeaders = ['BRAZIL 🇧🇷', 'FRANCE 🇫🇷', "BALLON D'OR"];

  return (
    <div className={`bg-gradient-to-br from-gray-900/50 to-green-900/20 border border-gray-800 rounded-2xl backdrop-blur ${compact ? 'p-4' : 'p-8'}`}>
      {/* Column Headers */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        <div />
        {colHeaders.map((col, i) => (
          <div key={i} className={`bg-gray-900/80 rounded-lg flex items-center justify-center text-center ${compact ? 'p-1.5' : 'p-3'}`}>
            <p className={`font-bold leading-tight ${col.includes('UCL') ? 'text-[#00ff88]' : 'text-white'} ${compact ? 'text-[9px]' : 'text-xs'}`}>
              {col}
            </p>
          </div>
        ))}
      </div>

      {/* Grid Rows */}
      {[0, 1, 2].map((rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-2 mb-2">
          <div className={`bg-gray-900/80 rounded-lg flex items-center justify-center ${compact ? 'p-1.5' : 'p-3'}`}>
            <p className={`text-white font-bold text-center leading-tight ${compact ? 'text-[9px]' : 'text-xs'}`}>
              {rowHeaders[rowIndex]}
            </p>
          </div>

          {[0, 1, 2].map((colIndex) => {
            const cell = gridData[rowIndex * 3 + colIndex];
            return (
              <div
                key={colIndex}
                className={`bg-gray-900/50 border-2 ${
                  cell.name === '?'
                    ? 'border-[#00ff88] animate-pulse'
                    : 'border-gray-800'
                } rounded-lg flex items-center justify-center hover:border-[#00ff88] transition cursor-pointer ${compact ? 'h-12' : 'h-20'}`}
              >
                <p className={`text-white font-medium text-center ${compact ? 'text-[10px]' : 'text-sm'}`}>
                  {cell.name}
                </p>
              </div>
            );
          })}
        </div>
      ))}

      {/* Score Footer */}
      <div className={`flex justify-between items-center ${compact ? 'mt-3' : 'mt-6'}`}>
        <span className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
          Score: <span className="font-bold text-white">8/9</span>
        </span>
        <span className={`text-[#00ff88] ${compact ? 'text-xs' : 'text-sm'}`}>
          ✓ Demo grid
        </span>
      </div>
    </div>
  );
}