import { getCurrentWindow } from "@tauri-apps/api/window";
import aeri from "./assets/puppy.png";

export default function App() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <img
        src={aeri}
        draggable={false}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          getCurrentWindow().startDragging();
        }}
        onDragStart={(e) => e.preventDefault()}
        style={{
          width: 70,
          height: 70,
          objectFit: "contain",
          cursor: "grab",
        }}
      />
    </div>
  );
}