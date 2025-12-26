import { SpurConfig } from './config';
import { SpurJoint } from './SpurJoint';

export function Spur({ config }: { config: SpurConfig }) {
  const seed = config.seed ?? 1234;

  return (
    <group>
      {config.joints.map((joint, i) => (
        <SpurJoint
          key={i}
          position={joint}
          textures={textures}
          seed={seed + i * 1000}
          options={config.jointOptions}
        />
      ))}
    </group>
  );
}
