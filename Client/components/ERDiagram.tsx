import { useEffect } from "react";
import mermaid from "mermaid";

interface ERDiagramProps {
  diagramDefinition: string;
}

const ERDiagram: React.FC<ERDiagramProps> = ({ diagramDefinition }) => {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, [diagramDefinition]);

  return (
    <div className="mermaid-container">
      {diagramDefinition && (
        <div className="mermaid">
          {diagramDefinition}
        </div>
      )}
    </div>
  );
};

export default ERDiagram;