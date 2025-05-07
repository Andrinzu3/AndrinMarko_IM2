export default function SchweizKarte() {
    return (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="..."
          width="800"
          height="600"
        >
          <path
            id="AG"
            d="M100,100 L150,100 L150,150 L100,150 Z"
            fill="#ccc"
            stroke="#000"
            onClick={() => alert("Aargau")}
          />
          {/* Weitere Pfade für andere Kantone */}
        </svg>
      </div>
    );
  }
  