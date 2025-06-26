import { useViewStore } from "@/store";
import QRScan from "@/components/QRScan";
import { useEffect } from "react";

function App() {
  const { view, setView } = useViewStore();

  useEffect(() => {
    setView(<QRScan />);
  }, [setView]);

  return view;
}

export default App;
