import { Text, Billboard } from "@react-three/drei";

interface AxisLabelsProps {
  organisms: string[];
  modalities: string[];
  organs: string[];
  cubeSize: number;
  gap: number;
  bandX: number;
  bandY: number;
  bandZ: number;
  dataOrganisms?: Set<string>;
  dataModalities?: Set<string>;
  dataOrgans?: Set<string>;
}

/** A label that always faces the camera */
function BillboardLabel({
  position,
  text,
  fontSize,
  color,
  anchorX,
  anchorY,
}: {
  position: [number, number, number];
  text: string;
  fontSize: number;
  color: string;
  anchorX?: "left" | "center" | "right";
  anchorY?: "top" | "middle" | "bottom";
}) {
  return (
    <Billboard position={position} follow lockX={false} lockY={false} lockZ={false}>
      <Text
        fontSize={fontSize}
        color={color}
        anchorX={anchorX ?? "center"}
        anchorY={anchorY ?? "middle"}
      >
        {text}
      </Text>
    </Billboard>
  );
}

export function AxisLabels({
  organisms,
  modalities,
  organs,
  cubeSize,
  gap,
  bandX,
  bandY,
  bandZ,
  dataOrganisms,
  dataModalities,
  dataOrgans,
}: AxisLabelsProps) {
  const half = cubeSize / 2;

  return (
    <group>
      {/* X axis: Organism labels — along front bottom edge */}
      {organisms.map((org, i) => {
        const x = -half + gap * (i + 1) + bandX * i + bandX / 2;
        const hasData = dataOrganisms ? dataOrganisms.has(org) : true;
        return (
          <BillboardLabel
            key={`org-${org}`}
            position={[x, -half - 0.14, half + 0.12]}
            text={org + (hasData ? "" : " ?")}
            fontSize={hasData ? 0.07 : 0.05}
            color={hasData ? "#374151" : "#b0b8c0"}
          />
        );
      })}
      <BillboardLabel
        position={[0, -half - 0.30, half + 0.12]}
        text="Organism"
        fontSize={0.06}
        color="#6b7280"
      />

      {/* Y axis: Modality labels — along left front edge */}
      {modalities.map((mod, j) => {
        const y = -half + gap * (j + 1) + bandY * j + bandY / 2;
        const hasData = dataModalities ? dataModalities.has(mod) : true;
        return (
          <BillboardLabel
            key={`mod-${mod}`}
            position={[-half - 0.14, y, half + 0.12]}
            text={(hasData ? mod : `${mod} ?`)}
            fontSize={hasData ? 0.06 : 0.045}
            color={hasData ? "#374151" : "#b0b8c0"}
            anchorX="right"
          />
        );
      })}
      <BillboardLabel
        position={[-half - 0.14, half + 0.10, half + 0.12]}
        text="Modality"
        fontSize={0.06}
        color="#6b7280"
        anchorX="right"
      />

      {/* Z axis: Organ labels — along right bottom edge */}
      {organs.map((organ, k) => {
        const z = -half + gap * (k + 1) + bandZ * k + bandZ / 2;
        const hasData = dataOrgans ? dataOrgans.has(organ) : true;
        return (
          <BillboardLabel
            key={`organ-${organ}`}
            position={[half + 0.14, -half - 0.14, z]}
            text={organ + (hasData ? "" : " ?")}
            fontSize={hasData ? 0.065 : 0.05}
            color={hasData ? "#374151" : "#b0b8c0"}
            anchorX="left"
          />
        );
      })}
      <BillboardLabel
        position={[half + 0.14, -half - 0.30, 0]}
        text="Organ"
        fontSize={0.06}
        color="#6b7280"
        anchorX="left"
      />
    </group>
  );
}
