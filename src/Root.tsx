import { Composition } from "remotion";
import { AdVideo } from "./compositions/AdVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AdVideo"
      component={AdVideo}
      durationInFrames={450}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
