export default function GridPreview() {
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
  
    return (
      <div className="bg-gradient-to-br from-gray-900/50 to-green-900/20 border border-gray-800 rounded-2xl p-8 backdrop-blur">
        {/* Column Headers */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div></div>
          <div className="bg-gray-900/80 rounded-lg p-3 text-center">
            <p className="text-white text-xs font-bold">REAL MADRID</p>
          </div>
          <div className="bg-gray-900/80 rounded-lg p-3 text-center">
            <p className="text-white text-xs font-bold">MAN CITY</p>
          </div>
          <div className="bg-gray-900/80 rounded-lg p-3 text-center">
            <p className="text-[#00ff88] text-xs font-bold">🏆 UCL</p>
          </div>
        </div>
        
        {/* Grid Rows */}
        {[0, 1, 2].map((rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-3 mb-3">
            {/* Row Header */}
            <div className="bg-gray-900/80 rounded-lg p-3 flex items-center justify-center">
              <p className="text-white text-xs font-bold text-center">
                {rowIndex === 0 && 'BRAZIL 🇧🇷'}
                {rowIndex === 1 && 'FRANCE 🇫🇷'}
                {rowIndex === 2 && "BALLON D'OR"}
              </p>
            </div>
            
            {/* Grid Cells */}
            {[0, 1, 2].map((colIndex) => {
              const cell = gridData[rowIndex * 3 + colIndex];
              return (
                <div 
                  key={colIndex}
                  className={`bg-gray-900/50 border-2 ${
                    cell.name === '?' 
                      ? 'border-[#00ff88] animate-pulse' 
                      : 'border-gray-800'
                  } rounded-lg p-4 flex items-center justify-center h-20 hover:border-[#00ff88] transition cursor-pointer`}
                >
                  <p className="text-white font-medium text-sm text-center">
                    {cell.name}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Score Footer */}
        <div className="flex justify-between items-center mt-6 text-sm">
          <span className="text-green-500">Rarity: <span className="font-bold">324</span></span>
          <span className="text-gray-400">Score: <span className="font-bold text-white">8/9</span></span>
        </div>
      </div>
    );
  }
  